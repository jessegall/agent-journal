<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\CreateAgent;
use App\Agents\Commands\StartOwnedAgent;
use App\Agents\Contracts\CallingProgram;
use App\Agents\Contracts\StartReservations;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\OwnerStartRequest;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\CommandBus;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\InstancePolicy;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSelection;
use App\Profiles\Values\StartProfileAuthority;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperJobUnfinished;
use Domain\Helpers\Exceptions\HelperLaunchUncertain;
use Domain\Helpers\Exceptions\HelperProfileMismatch;
use Domain\Helpers\Exceptions\HelperProfilesUnavailable;
use Domain\Helpers\Exceptions\HelperProfileTypeConflict;
use Domain\Helpers\Exceptions\HelperRequestConflict;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Readers\HelperCandidates;
use Domain\Helpers\Readers\HelperRecords;

/**
 * Dispatches a parent's work to a helper inside the command's transaction, in one order: the parent may delegate,
 * the profile is an activated helper profile within what the parent holds, the purpose, the helper, its start
 * reservation and a recheck of its work under it, then the job, its responsibility and Core's start. A refusal
 * anywhere rolls back everything written before it; a repeat of the request answers the job it made.
 */
final readonly class HelperDispatch
{
    private const string NEW_HELPER_REASON = 'A new helper starts a new conversation.';

    private const string OWN_HELPER_REASON = 'The profile keeps one helper, or one per job, and each job starts fresh.';

    private const string ADDRESSED_REASON = 'The helper you named starts a new conversation for this work.';

    public function __construct(
        private CurrentActor $actors,
        private ProfileSelections $profiles,
        private CallingProgram $callingProgram,
        private PurposeResolver $purposes,
        private HelperCandidates $candidates,
        private StartReservations $reservations,
        private ResponsibilityWriter $responsibilities,
        private HelperRecords $records,
        private CommandBus $commands,
    ) {}

    public function start(DispatchRequest $request): HelperReceipt
    {
        if ($this->isRepeat($request)) {
            return $this->repeated($request);
        }

        $profile = $this->admittedProfile($request->profileKey, $request->model, $request->programKey);
        $purpose = $this->purposeOf($request);

        if ($profile->instances !== InstancePolicy::Reusable) {
            $choice = new ConversationChoice(true, ConversationModeType::New, self::OWN_HELPER_REASON);

            return $this->launch($request, $profile, $purpose, $this->ownHelper($request, $profile), $choice);
        }

        $candidate = $this->candidatesFor($request, $profile, $purpose)[0] ?? null;

        if ($candidate === null) {
            $identity = $this->newHelper($request, $profile);

            return $this->launch($request, $profile, $purpose, $identity, new ConversationChoice(
                true,
                ConversationModeType::New,
                self::NEW_HELPER_REASON,
            ));
        }

        return $this->launch(
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

        $profile = $this->admittedProfile($request->profileKey, $request->model, $request->programKey);
        $identity = HelperIdentity::query()->whereKey($request->identityId)->first();

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

        return $this->launch($request, $profile, $purpose, $identity, $conversation);
    }

    /**
     * Launches another attempt at an unfinished job on the selection the parent names now, keeping its job, purpose,
     * brief, steering and source; the helper resumes its conversation.
     */
    public function continueJob(
        HelperJob $job,
        string $requestId,
        string $model,
        string|null $programKey,
    ): HelperReceipt {
        $identity = HelperIdentity::query()->whereKey($job->helper_identity_id)->sole();
        $profile = $this->admittedProfile($identity->profile_key, $model, $programKey);
        $this->reserve($identity);
        $job->reopenForAttempt();
        $start = $this->commands->run(new StartOwnedAgent(new OwnerStartRequest(
            $requestId,
            $identity->helperActor(),
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
        return HelperJob::query()->where('request_id', $request->requestId)->exists();
    }

    /**
     * The receipt of the job an earlier delivery of the same request made; a changed request under the id conflicts.
     */
    private function repeated(DispatchRequest $request): HelperReceipt
    {
        $job = HelperJob::query()->where('request_id', $request->requestId)->sole();

        if (! $job->wasDispatchedAs($request->digest())) {
            throw HelperRequestConflict::forRequest($request->requestId);
        }

        return $this->records->receiptOf($job->id);
    }

    /**
     * The profile's current selection, once the parent may delegate, the key names an activated helper profile and
     * that profile grants nothing the parent does not hold.
     */
    private function admittedProfile(string $profileKey, string $model, string|null $programKey): ProfileSelection
    {
        $authority = $this->actors->authority();
        $held = $authority instanceof StartProfileAuthority ? $authority->profile->start->access : null;

        if ($held !== null && ! $held->grants(AccessType::Delegate, ResourceAreaType::JournalWork)) {
            throw HelperUnavailable::toYou();
        }

        try {
            $profile = $this->profiles->select(
                ProfileKey::from($profileKey),
                ModelSelection::fromInput($model),
                $programKey,
                $this->callingProgram->programKey(),
            );
        } catch (ProfileMissing $missingProfile) {
            throw HelperProfilesUnavailable::forProfile($profileKey, $missingProfile);
        }

        if ($profile->base->isCoordinator()) {
            throw HelperProfileTypeConflict::forProfile($profileKey);
        }

        if ($held !== null && ! $held->contains($profile->start->access)) {
            throw HelperUnavailable::toYou();
        }

        return $profile;
    }

    private function purposeOf(DispatchRequest $request): HelperPurpose
    {
        $work = $request->work;

        return $this->purposes->resolve(new PurposeChoice(
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
            $profile->selection->program,
            $profile->selection->model,
            $request->work->independent,
        ));
    }

    /**
     * The helper a profile with single or per-job instances works with: the one designated helper of the profile, or a
     * fresh one for this job. A busy designated helper is refused by the launch, never copied.
     */
    private function ownHelper(DispatchRequest $request, ProfileSelection $profile): HelperIdentity
    {
        if ($profile->instances === InstancePolicy::PerJob) {
            return $this->newHelper($request, $profile);
        }

        return HelperIdentity::designatedFor($request->profileKey)->getOrCall(
            fn () => HelperIdentity::declareDesignated(
                $request->parent,
                $this->newActor($request, $profile),
                $request->profileKey,
                $profile->base->key,
            ),
        );
    }

    private function newActor(DispatchRequest $request, ProfileSelection $profile): ActorIdentity
    {
        return $this->commands->run(new CreateAgent(
            sprintf('%s helper', $profile->base->label),
            $request->profileKey,
        ));
    }

    private function newHelper(DispatchRequest $request, ProfileSelection $profile): HelperIdentity
    {
        $actor = $this->newActor($request, $profile);

        return HelperIdentity::declare($request->parent, $actor, $request->profileKey, $profile->base->key);
    }

    /**
     * Reserves the helper's start, checks its work again under the reservation, then writes the job and its
     * responsibility and runs Core's start; a lost race refuses and the work never moves to another helper.
     */
    private function launch(
        DispatchRequest $request,
        ProfileSelection $profile,
        HelperPurpose $purpose,
        HelperIdentity $identity,
        ConversationChoice $conversation,
    ): HelperReceipt {
        $helper = $identity->helperActor();
        $this->reserve($identity);
        $this->assertNoOpenJob($identity);
        $job = HelperJob::accept(
            $identity,
            $purpose,
            $request->parent,
            $request->work->brief,
            $request->work->sourceSnapshot(),
            new JobLaunch(
                $request->requestId,
                $request->digest(),
                $profile->revision,
                $conversation->isNewIdentity,
                $request->work->independent,
                $conversation->mode,
                $conversation->reason,
            ),
        );
        $this->responsibilities->assign($job->assignmentIdentity(), AssigneeIdentity::ofActorIdentity($helper));
        $start = $this->commands->run(new StartOwnedAgent(new OwnerStartRequest(
            $job->id,
            $helper,
            $job->assignmentIdentity(),
            $purpose->id,
            $profile->selection,
            $conversation->mode,
            $profile->startPolicy(),
        )));

        return $job->receipt($profile->base->key, $start, true);
    }

    private function reserve(HelperIdentity $identity): void
    {
        try {
            $this->reservations->reserve($identity->helperActor());
        } catch (AgentBusy $busyAgent) {
            throw HelperBusy::running($identity->id, $busyAgent);
        } catch (AgentNotAvailable|StartRefused $retired) {
            throw HelperRetired::forIdentity($identity->id, $retired);
        }
    }

    /**
     * Refuses a helper with a job that is not over, naming why: still working, stopped unfinished, or held while
     * nobody knows whether its launch runs.
     */
    private function assertNoOpenJob(HelperIdentity $identity): void
    {
        $open = HelperJob::query()
            ->ofIdentities([$identity->id])
            ->open()
            ->readLimit(1)
            ->first();

        if ($open === null) {
            return;
        }

        throw match ($open->state) {
            JobState::Unfinished => HelperJobUnfinished::onJob($identity->id, $open->id),
            JobState::Held => HelperLaunchUncertain::forIdentity($identity->id),
            default => HelperBusy::onJob($identity->id, $open->id),
        };
    }
}
