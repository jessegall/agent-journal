<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Access\Contracts\JournalAdmission;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Commands\CreateAgent\CreateAgentCommand;
use App\Agents\Commands\StartOwnedAgent\StartOwnedAgentCommand;
use App\Agents\Contracts\Events\HelperRecordFacts;
use App\Agents\Drivers\Contracts\CallingDriver;
use App\Agents\Enums\AccessType;
use App\Agents\Enums\ConversationModeType;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\AgentBusy;
use App\Exceptions\ConsoleOwnerMissing;
use App\Exceptions\CrossProjectEdge;
use App\Exceptions\ProfileMissing;
use App\Exceptions\StartRefused;
use App\Profiles\Enums\InstancePolicy;
use App\Projects\ProjectEdges;
use App\Records\Contracts\RecordResolver;
use App\Sessions\Contracts\ProfileSelections;
use App\Sessions\Contracts\StartReservations;
use App\Sessions\Exceptions\AgentNotAvailable;
use App\Sessions\OwnerStartRequest;
use App\Sessions\Values\ProfileSelection;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use App\Values\StartProfileAuthority;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperJobUnfinished;
use Domain\Helpers\Exceptions\HelperProfileMismatch;
use Domain\Helpers\Exceptions\HelperProfilesUnavailable;
use Domain\Helpers\Exceptions\HelperProfileTypeConflict;
use Domain\Helpers\Exceptions\HelperRequestConflict;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperStartUncertain;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\Readers\CandidateQuery;
use Domain\Helpers\Support\Readers\HelperCandidate;
use Domain\Helpers\Support\Readers\HelperCandidates;
use Domain\Helpers\Support\Readers\HelperRecords;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\SessionStartDetails;

/**
 * Dispatches a parent's work to a helper inside the command's transaction: it checks the parent may delegate and the
 * profile, then takes the purpose, the helper and its start reservation, then makes the job and Core's start. A refusal
 * rolls back everything; a repeat answers the job it made.
 */
final readonly class HelperDispatch
{
    private const string NEW_HELPER_REASON = 'A new helper starts a new conversation.';

    private const string OWN_HELPER_REASON = 'The profile keeps one helper, or one per job, and each job starts fresh.';

    private const string ADDRESSED_REASON = 'The helper you named starts a new conversation for this work.';

    public function __construct(
        private CurrentActor $actors,
        private ProfileSelections $profiles,
        private CallingDriver $callingDriver,
        private PurposeResolver $purposes,
        private HelperCandidates $candidates,
        private StartReservations $reservations,
        private ResponsibilityWriter $responsibilities,
        private HelperRecords $records,
        private CommandBus $commands,
        private JournalAdmission $admission,
        private HelperRecordFacts $helperFacts,
        private RecordResolver $recordResolver,
        private ProjectEdges $edges,
    ) {}

    public function start(DispatchRequest $request): HelperReceipt
    {
        if ($this->isRepeat($request)) {
            return $this->repeated($request);
        }

        $profile = $this->admittedProfile($request->profileKey, $request->model, $request->driverKey);
        $purpose = $this->purposeOf($request);

        if ($profile->instances !== InstancePolicy::Reusable) {
            $choice = new ConversationChoice(true, ConversationModeType::New, self::OWN_HELPER_REASON);

            return $this->startSession($request, $profile, $purpose, $this->ownHelper($request, $profile), $choice);
        }

        $candidate = $this->candidatesFor($request, $profile, $purpose)[0] ?? null;

        if ($candidate === null) {
            $identity = $this->newHelper($request, $profile);

            return $this->startSession($request, $profile, $purpose, $identity, new ConversationChoice(
                true,
                ConversationModeType::New,
                self::NEW_HELPER_REASON,
            ));
        }

        return $this->startSession(
            $request,
            $profile,
            $purpose,
            $candidate->identity,
            ConversationChoice::reusing($candidate),
        );
    }

    public function send(DispatchRequest $request): HelperReceipt
    {
        if ($this->isRepeat($request)) {
            return $this->repeated($request);
        }

        $profile = $this->admittedProfile($request->profileKey, $request->model, $request->driverKey);
        $identity = HelperIdentity::query()->inProject($request->projectId)->whereKey($request->identityId)->first();

        if ($identity === null) {
            throw HelperUnavailable::toYou();
        }

        if ($identity->profile_key !== $request->profileKey || $identity->profile_base !== $profile->base->key) {
            throw HelperProfileMismatch::forIdentity($identity->id, $identity->profile_key);
        }

        $this->assertNoOpenJob($identity);
        $purpose = $this->purposeOf($request);

        $candidates = array_filter(
            $this->candidatesFor($request, $profile, $purpose),
            fn (HelperCandidate $candidate) => $candidate->identity->id === $identity->id,
        );

        $conversation = $candidates === []
            ? new ConversationChoice(false, ConversationModeType::New, self::ADDRESSED_REASON)
            : ConversationChoice::reusing(array_values($candidates)[0]);

        return $this->startSession($request, $profile, $purpose, $identity, $conversation);
    }

    /**
     * Starts another attempt at an unfinished job on the selection the parent names now, keeping its job, purpose,
     * brief, steering and source; the helper resumes its conversation.
     */
    public function continueJob(
        HelperJob $job,
        string $requestId,
        string $model,
        string|null $driverKey,
    ): HelperReceipt {
        $identity = HelperIdentity::query()->whereKey($job->helper_identity_id)->sole();
        $profile = $this->admittedProfile($identity->profile_key, $model, $driverKey);
        $this->reserve($identity);
        $job->reopenForAttempt();

        $start = $this->commands->run(new StartOwnedAgentCommand(new OwnerStartRequest(
            $requestId,
            $identity->helperActor,
            $job->assignmentIdentity(),
            $job->helper_purpose_id,
            $profile->selection,
            ConversationModeType::Resume,
            $profile->startPolicy(),
        )));

        return $job->receipt($profile->base->key, $start, false);
    }

    private function isRepeat(DispatchRequest $request): bool
    {
        return HelperJob::query()->ofRequest($request->requestId)->exists();
    }

    /**
     * The receipt of the job an earlier delivery of the same request made; a changed request under the id conflicts.
     */
    private function repeated(DispatchRequest $request): HelperReceipt
    {
        $job = HelperJob::query()->ofRequest($request->requestId)->sole();

        if (! $job->wasDispatchedAs($request->digest())) {
            throw HelperRequestConflict::forRequest($request->requestId);
        }

        $identity = HelperIdentity::query()->whereKey($job->helper_identity_id)->sole();

        if ($job->status->isLive() && $this->hasRetired($identity)) {
            throw HelperRetired::withUnfinishedJob($identity->id, $job->id);
        }

        return $this->records->receiptOf($job->id);
    }

    /**
     * The profile's current selection, once the parent holds HelperPolicy/Delegate, the key names an activated helper
     * profile, and that profile's whole authority, its grants, named reads, denials and host scope, lies inside the
     * parent's frozen authority.
     */
    private function admittedProfile(string $profileKey, string $model, string|null $driverKey): ProfileSelection
    {
        $authority = $this->actors->authority();
        $parent = $authority instanceof StartProfileAuthority ? $authority->profile : null;

        if ($parent !== null && ! $parent->authorization->grants(HelperPolicy::class, AccessType::Delegate)) {
            throw HelperUnavailable::toYou();
        }

        try {
            $profile = $this->profiles->select(
                ProfileKey::from($profileKey),
                ModelSelection::fromInput($model),
                $driverKey,
                $this->callingDriver->driverKey(),
            );
        } catch (ProfileMissing $missingProfile) {
            throw HelperProfilesUnavailable::forProfile($profileKey, $missingProfile);
        }

        if ($profile->base->isCoordinator()) {
            throw HelperProfileTypeConflict::forProfile($profileKey);
        }

        $contained = $parent === null || (
            $parent->authorization->contains($profile->authorization)
            && $parent->start->access->contains($profile->start->access)
        );

        if (! $contained) {
            throw HelperUnavailable::toYou();
        }

        return $profile;
    }

    private function purposeOf(DispatchRequest $request): HelperPurpose
    {
        $work = $request->work;

        return $this->purposes->resolve(new PurposeChoice(
            $request->projectId,
            $request->parent,
            $request->profileKey,
            $work->subject,
            $work->purposeId,
            $work->purposeText,
        ));
    }

    /**
     * @return list<HelperCandidate>
     */
    private function candidatesFor(
        DispatchRequest $request,
        ProfileSelection $profile,
        HelperPurpose $purpose,
    ): array {
        return $this->candidates->candidatesFor(new CandidateQuery(
            $request->profileKey,
            $profile->base->key,
            $purpose,
            $profile->selection->driver,
            $profile->selection->model,
            $request->work->isIndependent,
        ));
    }

    /**
     * The helper a profile with single or per-job instances works with: the one designated helper of the profile, or a
     * fresh one for this job. A busy designated helper is refused by the start, never copied.
     */
    private function ownHelper(DispatchRequest $request, ProfileSelection $profile): HelperIdentity
    {
        if ($profile->instances === InstancePolicy::PerJob) {
            return $this->newHelper($request, $profile);
        }

        $designated = HelperIdentity::findDesignatedFor($request->projectId, $request->profileKey);

        if ($designated->isDefined() && ! $this->hasRetired($designated->get())) {
            $this->assertIndependentFor($request, $designated->get());

            return $designated->get();
        }

        $designated->forAll(fn (HelperIdentity $retired) => $retired->releaseDesignation());

        return HelperIdentity::create(
            $request->projectId,
            $this->designatedHolder($request),
            $this->newActor($request, $profile),
            $request->profileKey,
            $profile->base->key,
        )->designate();
    }

    /**
     * Whether the helper's agent retired, so its process has exited and the helper may be replaced.
     */
    private function hasRetired(HelperIdentity $identity): bool
    {
        return $this->reservations->hasRetired($identity->helper_actor);
    }

    /**
     * An independent review cannot go to the one designated helper once it worked on the same purpose.
     */
    private function assertIndependentFor(DispatchRequest $request, HelperIdentity $designated): void
    {
        if ($request->work->isIndependent && HelperJob::hasJobFor($designated, $this->purposeOf($request))) {
            throw HelperUnavailable::forIndependentReview($request->profileKey);
        }
    }

    /**
     * Who holds a designated helper: the installation's owner, so a manual and an automatic request reach the same
     * helper; the requester only when no owner is configured.
     */
    private function designatedHolder(DispatchRequest $request): ActorReference
    {
        try {
            return $this->admission->owner();
        } catch (ConsoleOwnerMissing) {
            return $request->parent;
        }
    }

    private function newActor(DispatchRequest $request, ProfileSelection $profile): ActorReference
    {
        return $this->commands->run(new CreateAgentCommand(
            sprintf('%s helper', $profile->base->label),
            $request->profileKey,
            $request->projectId,
        ));
    }

    private function newHelper(DispatchRequest $request, ProfileSelection $profile): HelperIdentity
    {
        $actor = $this->newActor($request, $profile);

        return HelperIdentity::create(
            $request->projectId,
            $request->parent,
            $actor,
            $request->profileKey,
            $profile->base->key,
        );
    }

    /**
     * Reserves the helper's start, checks its work again under the reservation, then writes the job and its
     * responsibility and runs Core's start; a lost race refuses and the work never moves to another helper.
     */
    private function startSession(
        DispatchRequest $request,
        ProfileSelection $profile,
        HelperPurpose $purpose,
        HelperIdentity $identity,
        ConversationChoice $conversation,
    ): HelperReceipt {
        $helper = $identity->helper_actor;
        $this->reserve($identity);
        $this->assertNoOpenJob($identity);
        $this->assertSourcesOfProject($request, $purpose);

        $job = HelperJob::create(
            $identity,
            $purpose,
            $request->parent,
            $request->work->brief,
            $request->work->sourceSubjects,
            new SessionStartDetails(
                $request->requestId,
                $request->digest(),
                $profile->revision,
                $conversation->isNewIdentity,
                $request->work->isIndependent,
                $conversation->mode,
                $conversation->reason,
            ),
        );

        $this->responsibilities->assign($job->assignmentIdentity(), AssigneeIdentity::ofActorReference($helper));

        $purpose->subject_record->forAll(
            fn (RecordIdentity $subject) => $this->helperFacts->assigned($subject, $helper->id),
        );

        $start = $this->commands->run(new StartOwnedAgentCommand(new OwnerStartRequest(
            $job->id,
            $helper,
            $job->assignmentIdentity(),
            $purpose->id,
            $profile->selection,
            $conversation->mode,
            $profile->startPolicy(),
            $request->driverType,
        )));

        return $job->receipt($profile->base->key, $start, true);
    }

    private function reserve(HelperIdentity $identity): void
    {
        try {
            $this->reservations->reserve($identity->helper_actor);
        } catch (AgentBusy $busyAgent) {
            throw HelperBusy::running($identity->id, $busyAgent);
        } catch (AgentNotAvailable|StartRefused $retired) {
            throw HelperRetired::forIdentity($identity->id, $retired);
        }
    }

    /**
     * Refuses a source record of another project than the job's; a Global record is a source of any job.
     *
     * @throws CrossProjectEdge
     */
    private function assertSourcesOfProject(DispatchRequest $request, HelperPurpose $purpose): void
    {
        foreach ($request->work->sourceRecords() as $source) {
            $this->edges->assertJoinable($purpose, $this->recordResolver->requireReadable($source));
        }
    }

    /**
     * Refuses a helper with a job that is not over, naming why: still working, stopped unfinished, or held while
     * nobody knows whether its start runs.
     */
    private function assertNoOpenJob(HelperIdentity $identity): void
    {
        $open = HelperJob::query()
            ->ofIdentities([$identity->id])
            ->open()
            ->limit(1)
            ->first();

        if ($open === null) {
            return;
        }

        throw match ($open->status) {
            JobStatus::Unfinished => HelperJobUnfinished::onJob($identity->id, $open->id),
            JobStatus::Held => HelperStartUncertain::forIdentity($identity->id),
            default => HelperBusy::onJob($identity->id, $open->id),
        };
    }
}
