<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\AgentRequests\Support\CallGroups;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The generated call groups match their calls: a check finds nothing to change, and a group is written with one
 * method per call that builds the call and sends it, its key last with a fresh default.
 */
#[TimeLimit(seconds: 20, reason: 'The check formats every generated file with Pint.')]
final class GeneratedCallsTest extends TestCase
{
    public function test_the_generated_files_are_current(): void
    {
        $this->artisan('journal:calls', ['--check' => true])->assertSuccessful();
    }

    public function test_a_group_has_one_method_per_call_with_the_key_last(): void
    {
        $source = (string) CallGroups::group(
            base_path('tests/Fixtures/AgentRequests'),
            'Tests\\Fixtures\\AgentRequests',
            'Notes',
        );

        $this->assertStringContainsString('final readonly class NoteCalls', $source);
        $this->assertStringContainsString('public function writeNote(', $source);
        $this->assertStringContainsString(
            '\\App\\AgentRequests\\Support\\CallKey $requestKey = new CallKey()',
            $source,
        );
        $this->assertStringContainsString('\\Tests\\Fixtures\\AgentRequests\\WriteNoteCall::from([', $source);
    }

    public function test_a_check_fails_on_a_changed_file(): void
    {
        $path = app_path('Client/Support/JournalClient.php');
        $original = (string) file_get_contents($path);
        file_put_contents($path, $original."\n// changed by hand\n");

        try {
            $this->artisan('journal:calls', ['--check' => true])
                ->expectsOutputToContain('app/Client/Support/JournalClient.php differs')
                ->assertFailed();
        } finally {
            file_put_contents($path, $original);
        }
    }
}
