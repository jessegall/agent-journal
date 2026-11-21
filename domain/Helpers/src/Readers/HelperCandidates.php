<?php

declare(strict_types=1);

namespace Domain\Helpers\Readers;

use App\Agents\Contracts\LaunchCandidates;
use App\Agents\Enums\LaunchCandidateRank;
use App\Agents\Support\LaunchCandidateFacts;
use App\Agents\Support\LaunchCandidateQuery;
use App\Agents\Support\LaunchProfileKey;
use App\Agents\Support\RankedLaunchCandidate;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;

/**
 * The acting parent's helpers that may take new work, best first (doc 14 decisions D0, D3 and D5): its own identities
 * of the same profile key and base, ranked by Agents from their work facts; an independent query drops every helper
 * that saw the subject in a job, a source or a conversation. The list is advisory: a start checks again under its lock.
 */
final readonly class HelperCandidates
{
    public function __construct(private LaunchCandidates $launches) {}

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

        $ranked = $this->launches->rank(new LaunchCandidateQuery(
            new LaunchProfileKey($query->profileKey),
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
            $hasSeenSubject = $candidate->sawThisPurpose || in_array($identity->id, $exposedIdentityIds, true);

            if ($query->independent && $hasSeenSubject) {
                continue;
            }

            $candidates[] = new HelperCandidate(
                $identity,
                $candidate->rank,
                $this->resumes($query, $candidate),
                $query->independent,
            );
        }

        return $candidates;
    }

    /**
     * @param  list<HelperJob>  $jobs
     */
    private function factsOf(HelperIdentity $identity, array $jobs, CandidateQuery $query): LaunchCandidateFacts
    {
        $finished = array_values(array_filter($jobs, fn (HelperJob $job) => $job->state === JobState::Finished));

        $matching = array_values(array_filter(
            $finished,
            fn (HelperJob $job) => $job->helper_purpose_id === $query->purpose->id,
        ));

        return new LaunchCandidateFacts(
            $identity->helperActor(),
            array_any($jobs, fn (HelperJob $job) => ! $job->state->isFinal()),
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
                ->where('helper_purpose_id', $query->purpose->id)
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
     * Only ordinary work on the same purpose with a conversation on the chosen program and model resumes it.
     */
    private function resumes(CandidateQuery $query, RankedLaunchCandidate $candidate): bool
    {
        return ! $query->independent && $candidate->rank === LaunchCandidateRank::ExactConversation;
    }

    /**
     * @param  list<HelperJob>  $jobs
     */
    private static function latestFinish(array $jobs): CarbonImmutable|null
    {
        $finishes = array_values(array_filter(array_map(fn (HelperJob $job) => $job->finished_at, $jobs)));

        return $finishes === [] ? null : max($finishes);
    }
}
