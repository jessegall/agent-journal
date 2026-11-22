<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Api\TaskLogLine;
use Domain\Tasks\Api\TaskTransition;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Http\Data\TaskStreamEntryData;
use Domain\Tasks\Http\Data\TaskStreamPageData;
use Spatie\LaravelData\Optional;

/**
 * A task's Logs: its history of changes and its run's log lines in one stream, newest first by time and then id, a
 * bounded page at a time. The cursor holds where each of the two reads stands, 'h,l' with a sequence, 'n' for the
 * newest or '0' when that read has nothing older.
 */
final readonly class TaskStream
{
    public const int PAGE = 30;

    public function __construct(
        private TaskHistoryResolver $history,
        private TaskLogResolver $log,
    ) {}

    public function page(string $taskId, string $before): TaskStreamPageData
    {
        [$historyBefore, $logBefore] = self::cursorOf($before);
        $changes = $this->changes($taskId, $historyBefore);
        $lines = $this->lines($taskId, $logBefore);

        $entries = [
            ...array_map(
                fn (TaskTransition $change) => ['at' => $change->at, 'id' => $change->id, 'change' => $change],
                $changes['entries'],
            ),
            ...array_map(
                fn (TaskLogLine $line) => ['at' => $line->at, 'id' => $line->id, 'line' => $line],
                $lines['entries'],
            ),
        ];
        usort(
            $entries,
            fn (array $first, array $second) => [$second['at'], $second['id']] <=> [$first['at'], $first['id']],
        );
        $shown = array_slice($entries, 0, self::PAGE);

        $historyNext = self::nextOf($historyBefore, $changes, array_column($shown, 'change'));
        $logNext = self::nextOf($logBefore, $lines, array_column($shown, 'line'));

        return TaskStreamPageData::from([
            'before' => $before,
            'entries' => array_reverse(array_map(
                fn (array $entry) => isset($entry['change'])
                    ? TaskStreamEntryData::ofTransition($entry['change'])
                    : TaskStreamEntryData::ofLine($entry['line']),
                $shown,
            )),
            'olderBefore' => $historyNext === '0' && $logNext === '0' ? Optional::create() : "{$historyNext},{$logNext}",
        ]);
    }

    /**
     * @return array{entries: list<TaskTransition>, hasOlder: bool}
     */
    private function changes(string $taskId, int|null $before): array
    {
        if ($before === 0) {
            return ['entries' => [], 'hasOlder' => false];
        }

        $page = $this->history->historyOf($taskId, $before, self::PAGE);

        return ['entries' => $page->entries, 'hasOlder' => $page->nextBefore !== null];
    }

    /**
     * @return array{entries: list<TaskLogLine>, hasOlder: bool}
     */
    private function lines(string $taskId, int|null $before): array
    {
        if ($before === 0) {
            return ['entries' => [], 'hasOlder' => false];
        }

        $page = $before === null
            ? $this->log->newest($taskId, self::PAGE)
            : $this->log->before($taskId, $before, self::PAGE);

        return ['entries' => $page->lines, 'hasOlder' => $page->olderBefore !== null];
    }

    /**
     * Where one read stands after the page: before its oldest entry shown, unchanged when none was shown, or '0' once
     * everything it read was shown and nothing older remains.
     *
     * @param  array{entries: list<TaskTransition|TaskLogLine>, hasOlder: bool}  $read
     * @param  list<TaskTransition|TaskLogLine>  $shown
     */
    private static function nextOf(int|null $before, array $read, array $shown): string
    {
        if (count($shown) === count($read['entries']) && ! $read['hasOlder']) {
            return '0';
        }

        if ($shown === []) {
            return $before === null ? 'n' : (string) $before;
        }

        return (string) min(array_map(fn (TaskTransition|TaskLogLine $entry) => $entry->sequence, $shown));
    }

    /**
     * @return array{0: int|null, 1: int|null}
     */
    private static function cursorOf(string $before): array
    {
        if ($before === '') {
            return [null, null];
        }

        $parts = array_pad(explode(',', $before, 2), 2, 'n');

        [$first, $second] = array_map(fn (string $part) => $part === 'n' ? null : max(0, (int) $part), $parts);

        return [$first, $second];
    }
}
