<?php

declare(strict_types=1);

namespace Domain\Helpers\Support\Readers;

use App\Contracts\Sessions\SessionStartCandidates;
use App\Enums\Sessions\StartCandidateRank;
use App\Support\RankedStartCandidate;
use App\Support\StartCandidateFacts;
use App\Support\StartCandidateQuery;
use App\Support\StartProfileKey;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;

/**
 * The acting parent's helpers that may take new work, best first: its own identities
 * of the same profile key and base, ranked by Agents from their work facts; an independent query drops every helper
 * that saw the subject in a job, a source or a conversation. The list is advisory: a start checks again under its lock.
 */
final readonly class HelperCandidates
{
    public function __construct(private SessionStartCandidates $starts) {}

    /**
     * @return list<HelperCandidate>
     */
    public function candidatesFor(CandidateQuery $query): array
    {
        $identities = HelperIdentity::query()
            ->ofProfile($query->profileKey, $query->profileBase)
            ->readAll('the parent\'s helper identities of one profile, every one a candidate')
            ->get()
            ->keyBy(fn (HelperIdentity $identity) => $identity->helper_actor_id);

        $identityIds = array_values(
            array_map(fn (HelperIdentity $identity): string => $identity->id, $identities->all()),
        );

        $jobs = HelperJob::query()
            ->ofIdentities($identityIds)
            ->readAll('the jobs of those identities, for their open work and last finishes')
            ->get()
            ->groupBy('helper_identity_id');

        $exposedIdentityIds = $this->exposedIdentities($query, $identityIds);

        $ranked = $this->starts->rank(new StartCandidateQuery(
            new StartProfileKey($query->profileKey),
            $query->driver,
            $query->model,
            $query->purpose->id,
            array_values($identities->map(fn (HelperIdentity $identity) => $this->factsOf(
                $identity,
                array_values($jobs->get($identity->id, collect())->all()),
                $query,
            ))->all()),
        ));

        $candidates = [];

        foreach ($ranked as $candidate) {
            $identity = $identities[$candidate->actor->id];
            $hasSeenSubject = $candidate->hasSeenThisPurpose || in_array($identity->id, $exposedIdentityIds, true);

            if ($query->isIndependent && $hasSeenSubject) {
                continue;
            }

            $candidates[] = new HelperCandidate(
                $identity,
                $candidate->rank,
                $this->resumes($query, $candidate),
                $query->isIndependent,
            );
        }

        return $candidates;
    }

    /**
     * @param  list<HelperJob>  $jobs
     */
    private function factsOf(HelperIdentity $identity, array $jobs, CandidateQuery $query): StartCandidateFacts
    {
        $finished = array_values(array_filter($jobs, fn (HelperJob $job) => $job->status === JobStatus::Finished));

        $matching = array_values(array_filter(
            $finished,
            fn (HelperJob $job) => $job->helper_purpose_id === $query->purpose->id,
        ));

        return new StartCandidateFacts(
            $identity->helper_actor,
            array_any($jobs, fn (HelperJob $job) => ! $job->status->isFinal()),
            $matching !== [],
            self::latestFinish($matching),
            self::latestFinish($finished),
        );
    }

    /**
     * The identities whose jobs saw the subject: a job for a purpose about it, or one handed it in its source.
     *
     * @param  list<string>  $identityIds
     * @return list<string>
     */
    private function exposedIdentities(CandidateQuery $query, array $identityIds): array
    {
        $subject = $query->subject();

        if ($subject === null) {
            return array_values(HelperJob::query()
                ->ofIdentities($identityIds)
                ->ofHelperPurpose($query->purpose->id)
                ->readAll('the jobs of the parent\'s helpers for this free purpose')
                ->get()
                ->map(fn (HelperJob $job): string => $job->helper_identity_id)
                ->values()
                ->all());
        }

        return array_values(HelperJob::query()
            ->ofIdentities($identityIds)
            ->exposedTo($subject)
            ->readAll('the jobs of the parent\'s helpers that saw this subject')
            ->get()
            ->map(fn (HelperJob $job): string => $job->helper_identity_id)
            ->values()
            ->all());
    }

    /**
     * Only ordinary work on the same purpose with a conversation on the chosen driver and model resumes it.
     */
    private function resumes(CandidateQuery $query, RankedStartCandidate $candidate): bool
    {
        return ! $query->isIndependent && $candidate->rank === StartCandidateRank::ExactConversation;
    }

    /**
     * @param  list<HelperJob>  $jobs
     */
    private static function latestFinish(array $jobs): CarbonImmutable|null
    {
        $finishes = array_values(array_filter(array_map(fn (HelperJob $job) => $job->finished_at, $jobs)));

        if ($finishes === []) {
            return null;
        }

        return max($finishes);
    }
}
