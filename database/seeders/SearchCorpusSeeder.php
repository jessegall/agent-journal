<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NumberGroup;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * A corpus of about a million tasks for measuring search: realistic titles and briefs from a small vocabulary,
 * spread over five environments, numbered in a group of their own, with a few planted titles the measurement
 * looks for. It is run on purpose for a measurement, never by the ordinary suite or the database seeder.
 */
final class SearchCorpusSeeder extends Seeder
{
    public const int TASK_COUNT = 1_000_000;

    public const string RARE_LATE_TITLE = 'Quarterly zephyr audit';

    public const string EARLIEST_PREFIX_TITLE = 'Ledger reconciliation notes';

    private const int CHUNK = 1000;

    private const string HOLDER_TYPE = 'search-corpus';

    private const array ENVIRONMENTS = [null, null, 'environment-a', 'environment-b', 'environment-c'];

    private const array WORDS = [
        'review', 'release', 'driver', 'migration', 'settings', 'plan', 'report', 'agent', 'merge', 'worker',
        'queue', 'index', 'search', 'palette', 'budget', 'deadline', 'session', 'profile', 'grant', 'policy',
        'domain', 'record', 'passage', 'brief', 'title', 'cursor', 'handle', 'source', 'batch', 'scope',
    ];

    public function run(int $count = self::TASK_COUNT): void
    {
        $groupId = $this->corpusGroup();
        $now = now();

        for ($first = 1; $first <= $count; $first += self::CHUNK) {
            $rows = [];

            foreach (range($first, min($count, $first + self::CHUNK - 1)) as $number) {
                $rows[] = [
                    'id' => strtolower((string) Str::ulid()),
                    'number_group_id' => $groupId,
                    'number' => $number,
                    'title' => $this->titleFor($number, $count),
                    'brief' => $this->briefFor($number),
                    'creator_type' => 'user',
                    'creator_id' => 'search-corpus',
                    'environment_id' => self::ENVIRONMENTS[$number % count(self::ENVIRONMENTS)],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            Task::query()->insert($rows);
        }
    }

    private function corpusGroup(): string
    {
        $holderId = strtolower((string) Str::ulid());
        NumberGroup::create(self::HOLDER_TYPE, $holderId, Task::LINK_TYPE);

        return (string) NumberGroup::query()->forRecords(self::HOLDER_TYPE, $holderId, Task::LINK_TYPE)->value('id');
    }

    private function titleFor(int $number, int $count): string
    {
        if ($number === 1) {
            return self::EARLIEST_PREFIX_TITLE;
        }

        if ($number === $count - 10) {
            return self::RARE_LATE_TITLE;
        }

        return ucfirst(implode(' ', $this->wordsFor($number, 3 + $number % 4)));
    }

    private function briefFor(int $number): string
    {
        return ucfirst(implode(' ', $this->wordsFor($number * 7, 30 + $number % 40))).'.';
    }

    /**
     * @return list<string>
     */
    private function wordsFor(int $seed, int $count): array
    {
        $words = [];

        foreach (range(1, $count) as $index) {
            $words[] = self::WORDS[($seed * 31 + $index * 17) % count(self::WORDS)];
        }

        return $words;
    }
}
