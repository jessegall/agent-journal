<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Values\TurnEnd;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * The journal alone judges how a turn ended, from what the host saw.
 */
final class TurnEndTest extends TestCase
{
    #[DataProvider('ends')]
    public function test_a_turns_end_is_judged_from_what_the_host_saw(
        TurnEnd $end,
        RequestProgress $progress,
        RequestOutcome|null $outcome,
    ): void {
        $this->assertSame([$progress, $outcome], [$end->progress(), $end->outcome()]);
    }

    /**
     * @return iterable<string, array{TurnEnd, RequestProgress, RequestOutcome|null}>
     */
    public static function ends(): iterable
    {
        $failed = [RequestProgress::Failed, RequestOutcome::TurnFailed];
        $applied = [RequestProgress::Applied, null];

        yield 'a successful result' => [new TurnEnd(exitCode: 0, isResultRead: true, resultSubtype: 'success'), ...$applied];

        yield 'a result marked an error' => [
            new TurnEnd(exitCode: 0, isResultRead: true, resultSubtype: 'success', isResultError: true),
            ...$failed,
        ];

        yield 'a result of another subtype' => [
            new TurnEnd(exitCode: 0, isResultRead: true, resultSubtype: 'error_during_execution'),
            ...$failed,
        ];

        yield 'a process that exited with an error' => [new TurnEnd(exitCode: 3), ...$failed];

        yield 'a process that exited well' => [new TurnEnd(exitCode: 0), ...$applied];

        yield 'a completed Codex turn' => [new TurnEnd(codexStatus: 'completed'), ...$applied];

        yield 'an interrupted Codex turn' => [new TurnEnd(codexStatus: 'interrupted'), ...$applied];

        yield 'a failed Codex turn' => [new TurnEnd(codexStatus: 'failed'), ...$failed];

        yield 'a Codex owner that exited' => [new TurnEnd(codexStatus: 'ownerExited'), ...$failed];

        yield 'a terminal turn whose composer came back' => [new TurnEnd(composerLeft: true), ...$applied];

        yield 'an end the host could not read' => [
            new TurnEnd(problem: 'the owner closed the thread'),
            RequestProgress::DeliveryUncertain,
            null,
        ];
    }
}
