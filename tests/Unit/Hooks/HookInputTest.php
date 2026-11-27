<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Inputs\Values\StopDetails;
use App\Stacks\AgentState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestActors;
use Tests\TestCase;

final class HookInputTest extends TestCase
{
    /**
     * @return iterable<string, array{string, string}>
     */
    public static function inputs(): iterable
    {
        $methods = [
            'session start' => 'onSessionStart',
            'prompt' => 'onPrompt',
            'shell command' => 'onShellCommand',
            'file edit' => 'onFileEdit',
            'tool requested' => 'onToolRequested',
            'stop' => 'onStop',
            'compaction' => 'onCompaction',
            'tool finished' => 'onToolFinished',
            'session end' => 'onSessionEnd',
        ];

        foreach ($methods as $hook => $method) {
            yield $hook => [$hook, $method];
        }
    }

    #[DataProvider('inputs')]
    public function test_each_input_asks_the_state_for_its_own_hook_method(string $hook, string $method): void
    {
        $input = HookInputs::of($hook);
        $recording = new RecordState();
        $plainState = new class extends AgentState {};

        $this->assertSame($method, $input->methodName());
        $this->assertEquals(Decision::delegate(), $input->answerBy($recording));
        $this->assertSame([$method], $recording->askedMethods);
        $this->assertEquals(Decision::delegate(), $input->answerBy($plainState));
    }

    public function test_an_input_keeps_the_identity_it_was_given(): void
    {
        $hook = TestActors::hookIdentity(7, 9, 'hook-7', 'digest-7');

        $this->assertSame($hook, new StopRequested($hook, new StopDetails('turn-7', true, ''))->identity());
    }
}
