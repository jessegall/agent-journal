<?php

declare(strict_types=1);

namespace App\Asks;

use App\Asks\Enums\CoreAskType;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use Carbon\CarbonImmutable;

/**
 * Decides which asks are due to advance. Each holder answers its queue in order: question and stuck asks first, then
 * the oldest. The ask it answers now runs on its response allowance from when the holder became free; an ask queued
 * behind it waits from that answer's deadline, so a holder that keeps answering never lets its queue escalate. An ask
 * past its lifetime is due whatever its clock says.
 */
final readonly class AskClock
{
    /**
     * The most open hops one pass weighs.
     */
    private const int SCAN_LIMIT = 200;

    public function __construct(private AskTypeRegistry $types) {}

    /**
     * The current hops whose ask is due, the longest overdue first.
     *
     * @return list<AskHop>
     */
    public function dueHops(CarbonImmutable $now, int $limit): array
    {
        $hops = AskHop::findUnansweredCurrent(self::SCAN_LIMIT);
        $asks = Ask::findOpenByIds(array_values(array_unique(array_map(fn (AskHop $hop) => $hop->ask_id, $hops))));
        $answerTimes = AskHop::resolveLastAnswerTimes();
        $deadlines = [];

        foreach ($this->queues($hops, $asks) as $holderKey => $queue) {
            $free = $answerTimes[$holderKey] ?? null;
            $answeringDeadline = null;

            foreach ($queue as $hop) {
                $ask = $asks[$hop->ask_id];

                $start = max([$hop->accepted_at, ...array_filter([$free, $answeringDeadline])]);

                $deadline = $start->add($this->types->get($ask->type_key)->allowance());
                $answeringDeadline ??= $deadline;

                if ($deadline <= $now || $ask->hasOutlived($now)) {
                    $deadlines[$hop->id] = [
                        $deadline,
                        $hop,
                    ];
                }
            }
        }

        usort($deadlines, fn (array $first, array $second) => $first[0] <=> $second[0]);

        return array_slice(array_map(fn (array $due) => $due[1], $deadlines), 0, $limit);
    }

    /**
     * The hops of each holder in the order the holder answers them.
     *
     * @param  list<AskHop>  $hops
     * @param  array<string, Ask>  $asks
     * @return array<string, list<AskHop>>
     */
    private function queues(array $hops, array $asks): array
    {
        $queues = [];

        foreach ($hops as $hop) {
            if (array_key_exists($hop->ask_id, $asks)) {
                $queues[$hop->holderKey][] = $hop;
            }
        }

        return array_map(function (array $queue): array {
            usort($queue, fn (AskHop $first, AskHop $second) => self::place($first) <=> self::place($second));

            return $queue;
        }, $queues);
    }

    /**
     * Where the hop stands in its holder's queue: urgent types first, then the oldest, then by id.
     *
     * @return array{int, CarbonImmutable, string}
     */
    private static function place(AskHop $hop): array
    {
        $urgentKeys = CoreAskType::urgentKeys();

        return [
            in_array($hop->type_key, $urgentKeys, true) ? 0 : 1,
            $hop->accepted_at,
            $hop->id,
        ];
    }
}
