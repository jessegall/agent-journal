<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\StopDetails;
use App\Support\States\AgentState;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestActors;

final class HookInputTest extends TestCase
{
    /**
     * @return iterable<string, array{HookInput, string}>
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

        foreach (HookInputs::all() as $name => $input) {
            yield $name => [$input, $methods[$name]];
        }
    }

    #[DataProvider('inputs')]
    public function test_each_input_asks_the_state_for_its_own_hook_method(HookInput $input, string $method): void
    {
        $recording = new RecordingState();
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
