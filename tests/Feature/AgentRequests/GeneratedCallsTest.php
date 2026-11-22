<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\Support\CallGroups;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The generated call groups match their calls: a check finds nothing to change, and a group is written with one
 * method per call that builds the call and sends it, its key last with a fresh default.
 */
#[TimeLimit(seconds: 20, reason: 'The check formats every generated file with Pint.')]
final class GeneratedCallsTest extends TestCase
{
    private const string WRITE_METHOD = 'public function writeNote(';

    private const string CLASS_DECLARATION = 'final readonly class NoteCalls';

    private const string KEY_PARAMETER = '\\App\\Support\\CallKey $requestKey = new CallKey()';

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

        $this->assertStringContainsString(self::CLASS_DECLARATION, $source);
        $this->assertStringContainsString(self::WRITE_METHOD, $source);
        $this->assertStringContainsString(
            self::KEY_PARAMETER,
            $source,
        );
        $this->assertStringContainsString('\\Tests\\Fixtures\\AgentRequests\\WriteNoteCall::from([', $source);
    }

    public function test_a_check_fails_on_a_changed_file(): void
    {
        $path = app_path('Client/Support/JournalClient.php');
        $original = (string) file_get_contents($path);
        file_put_contents($path, $original.<<<'TEXT'

        // changed by hand

        TEXT);

        try {
            $this->artisan('journal:calls', ['--check' => true])
                ->expectsOutputToContain('app/Support/JournalClient.php differs')
                ->assertFailed();
        } finally {
            file_put_contents($path, $original);
        }
    }
}
