<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\AssignmentSet;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentResolver as AssignmentResolverContract;
use App\Assignments\Contracts\SharedHolders;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\InvalidAssignmentPage;
use App\Models\Records\AssignmentRecord;
use App\Records\RecordIds;
use App\Support\AssigneeIdentity;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Builder;
use Psr\Log\LoggerInterface;

/**
 * Reads the assignments the actor of this request may see, in bounded batches: each record's owner says which records
 * are visible with one query per type, and Core reads their assignments with one more. A hidden record never shows,
 * not even as a count or in a cursor.
 */
final readonly class AssignmentResolver implements AssignmentResolverContract
{
    private const int LARGEST_BATCH = 100;

    public function __construct(
        private CurrentActor $actors,
        private AssignmentProviders $providers,
        private LoggerInterface $log,
        private SharedHolders $shared,
    ) {}

    /**
     * @param  list<RecordIdentity>  $records
     */
    public function assignmentsFor(array $records): AssignmentSet
    {
        $this->actors->actor();

        if (count($records) > self::LARGEST_BATCH) {
            throw InvalidAssignmentPage::forRecordCount(count($records));
        }

        $visibleIdsByType = [];

        foreach (RecordIdentity::groupedByType($records) as $type => $ofType) {
            $visible = $this->visibleAmong($type, $ofType);
            $visibleIdsByType[$type] = array_map(fn (RecordIdentity $record) => $record->id, $visible);
        }

        $visibleIdsByType = array_filter($visibleIdsByType);

        if ($visibleIdsByType === []) {
            return new AssignmentSet([]);
        }

        $rows = AssignmentRecord::query()
            ->ofAnyRecords($visibleIdsByType)
            ->readExactly(array_sum(array_map(count(...), $visibleIdsByType)))
            ->oldestFirst()
            ->get();

        return new AssignmentSet(array_values($rows->map(fn (AssignmentRecord $row) => $row->to_assignment)->all()));
    }

    public function recordIdsFor(string $type, AssigneeIdentity $holder, IdListPage $page): RecordIds
    {
        $this->actors->actor();
        $ids = [];
        $examinedUpTo = $page->afterId;

        while (true) {
            $candidates = AssignmentRecord::query()
                ->heldOrShared($holder, $this->shared->sharedWith($holder))
                ->withRecordType($type)
                ->when($examinedUpTo !== null, fn (Builder $query) => $query->recordAfter($examinedUpTo))
                ->byRecordId()
                ->limit(self::LARGEST_BATCH)
                ->pluck('record_id')
                ->map(fn (mixed $id) => (string) $id)
                ->values()
                ->all();

            if ($candidates === []) {
                return new RecordIds($ids, null);
            }

            $visible = array_map(
                fn (RecordIdentity $record) => $record->id,
                $this->visibleAmong(
                    $type,
                    array_values(array_map(fn (string $id) => new RecordIdentity($type, $id), $candidates)),
                ),
            );

            foreach ($candidates as $candidate) {
                $examinedUpTo = $candidate;

                if (in_array($candidate, $visible, true)) {
                    $ids[] = $candidate;
                }

                if (count($ids) === $page->limit) {
                    return new RecordIds($ids, $examinedUpTo);
                }
            }

            if (count($candidates) < self::LARGEST_BATCH) {
                return new RecordIds($ids, null);
            }
        }
    }

    /**
     * @return list<string>
     */
    public function allRecordIdsFor(string $type, AssigneeIdentity $holder): array
    {
        $ids = [];
        $afterId = null;

        do {
            $page = $this->recordIdsFor($type, $holder, new IdListPage($afterId, IdListPage::LARGEST_LIMIT));
            array_push($ids, ...$page->ids);
            $afterId = $page->nextAfterId;
        } while ($afterId !== null);

        return $ids;
    }


    /**
     * The owner's visible subset of records of one type, kept to the records asked about.
     *
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     *
     * @throws AssignmentTypeUnavailable
     */
    private function visibleAmong(string $type, array $records): array
    {
        try {
            $answered = $this->providers->recordProvider($type)->visibleRecords($records);
        } catch (AssignmentTypeUnavailable $unavailable) {
            $this->log->warning(
                'Assignments were read for a record type no installed domain provides.',
                ['type' => $type],
            );

            throw $unavailable;
        }

        return array_values(
            array_filter(
                $records,
                fn (RecordIdentity $record) => array_any(
                    $answered,
                    fn (RecordIdentity $visible) => $visible->isSameAs($record),
                ),
            ),
        );
    }
}
