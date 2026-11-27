<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Agents\Values\RelayedHookCommand;
use App\Hosts\HostProtocol;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The journal's side of host protocol 1 is generated from protocol/host.json and follows it: the generated files are
 * current, a hand edit of one fails the check, and the hook command the journal writes carries exactly journal-hook's
 * arguments (rule 117, doc 143).
 */
#[TimeLimit(seconds: 20, reason: 'The check formats every generated PHP file with Pint.')]
final class HostProtocolTest extends TestCase
{
    public function test_the_generated_files_are_current(): void
    {
        $this->artisan('journal:host-protocol', ['--check' => true])->assertSuccessful();
    }

    public function test_a_hand_edit_of_a_generated_go_file_fails_the_check(): void
    {
        $path = base_path('programs/agent/hostapi/protocol_gen.go');
        $original = (string) file_get_contents($path);
        file_put_contents($path, $original."\n// changed by hand\n");

        try {
            $this->artisan('journal:host-protocol', ['--check' => true])
                ->expectsOutputToContain('programs/agent/hostapi/protocol_gen.go differs')
                ->assertFailed();
        } finally {
            file_put_contents($path, $original);
        }
    }

    public function test_the_hook_command_carries_exactly_the_arguments_journal_hook_takes(): void
    {
        $command = RelayedHookCommand::for('/opt/journal/bin/journal-hook', 'claude-code')->text;

        $this->assertCount(count(HostProtocol::HOOK_ARGUMENTS), array_slice(explode(' ', $command), 1));
    }
}
