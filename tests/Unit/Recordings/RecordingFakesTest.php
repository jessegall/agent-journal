<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\InstructionSignature;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Recordings\Exceptions\RecordedEnvironmentRefused;
use App\Recordings\Exceptions\RecordingLeaks;
use App\Recordings\Exceptions\RecordingOutsideContainer;
use App\Recordings\RecordingFakes;
use App\Recordings\RecordingOpening;
use App\Values\HostProcessPlan;
use Tests\TestCase;

/**
 * A recording keeps no real value: a folder of the process's environment becomes its variable, every other kind of
 * real value a fake of its shape, one fake to a value through a run and the same on a re-record; the user's own session
 * variables, a driver outside the agent image and a value left behind each refuse it; faked instructions are signed anew.
 */
final class RecordingFakesTest extends TestCase
{
    public function test_a_folder_of_the_environment_becomes_its_variable(): void
    {
        $fakes = new RecordingFakes(['CODEX_HOME' => '/srv/accounts/owner/codex', 'PATH' => '/usr/bin:/bin'], []);

        $this->assertSame(
            ['{env:CODEX_HOME}/auth.json', '/usr/bin:/bin'],
            [$fakes->replaceIn('/srv/accounts/owner/codex/auth.json'), $fakes->replaceIn('/usr/bin:/bin')],
        );
    }

    public function test_addresses_tokens_and_the_users_folders_become_fakes(): void
    {
        $fakes = new RecordingFakes([], []);

        $this->assertSame(
            [
                RecordingFakes::EMAIL,
                RecordingFakes::JSON_WEB_TOKEN,
                'sk-'.RecordingFakes::TOKEN,
                '{"access_token":"'.RecordingFakes::TOKEN.'"}',
                '{"orgName":"'.RecordingFakes::ORGANIZATION.'"}',
                RecordingFakes::USER_FOLDER.'/projects',
                '-home-user-projects',
            ],
            [
                $fakes->replaceIn('someone@company.example'),
                $fakes->replaceIn('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.c2lnbmF0dXJlLXZhbHVl'),
                $fakes->replaceIn('sk-ant-oat01-abcdefghijklmnopqrstuvwxyz'),
                $fakes->replaceIn('{"access_token":"a1b2c3d4e5f6"}'),
                $fakes->replaceIn('{"orgName":"Someone\'s Organization"}'),
                $fakes->replaceIn('/Users/someone/projects'),
                $fakes->replaceIn('-Users-someone-projects'),
            ],
        );
    }

    public function test_one_uuid_is_one_fake_and_a_fake_stays_as_it_is(): void
    {
        $fakes = new RecordingFakes([], []);
        $first = $fakes->replaceIn('9b2f4c1e-7d3a-4e5b-8c6d-1a2b3c4d5e6f');

        $this->assertSame(
            [$first, '00000000-0000-4000-8000-000000000042', 'org-0000000000000002'],
            [
                $fakes->replaceIn('9b2f4c1e-7d3a-4e5b-8c6d-1a2b3c4d5e6f'),
                $fakes->replaceIn('00000000-0000-4000-8000-000000000042'),
                $fakes->replaceIn('org-AbCdEfGhIjKlMnOp'),
            ],
        );
    }

    public function test_the_users_terminal_variables_refuse_the_recording(): void
    {
        $plan = $this->planWith(['ITERM_SESSION_ID=w0t0p0', 'LANG=C.UTF-8'], ['CLAUDE_CODE_ENTRYPOINT']);
        $opening = RecordingOpening::ofProcess('terminal', $plan->payload(), 0);

        $refusal = RecordedEnvironmentRefused::naming(['CLAUDE_CODE_ENTRYPOINT', 'ITERM_SESSION_ID']);
        $this->expectExceptionObject($refusal);

        new RecordingFakes([], [])->assertClean($opening, '');
    }

    public function test_a_driver_exchange_outside_the_agent_image_is_refused(): void
    {
        $opening = RecordingOpening::ofProcess('terminal', $this->planWith(['LANG=C.UTF-8'])->payload(), 0);

        $this->expectException(RecordingOutsideContainer::class);

        new RecordingFakes([], [])->assertClean($opening, 'journal-agent@sha256:1');
    }

    public function test_each_value_becomes_one_fake_of_its_shape_the_same_on_a_rerecord(): void
    {
        $text = 'thread 01jd8x0g9m3qz6v4k2t7r5w1ca digest '.str_repeat('ab', 32)
            .' JOURNAL_START_TOKEN=s3cr3t-grant again 01jd8x0g9m3qz6v4k2t7r5w1ca';

        $first = new RecordingFakes([], [])->replaceIn($text);
        $again = new RecordingFakes([], [])->replaceIn($text);

        $this->assertSame(
            [
                'thread 00000000000000000000000001 digest '.str_pad('2', 64, '0', STR_PAD_LEFT)
                    .' JOURNAL_START_TOKEN='.RecordingFakes::SECRET.' again 00000000000000000000000001',
                true,
            ],
            [$first, $first === $again],
        );
    }

    public function test_a_real_value_left_in_the_faked_recording_stops_it(): void
    {
        $this->expectExceptionObject(RecordingLeaks::at([1]));

        new RecordingFakes([], [])->assertNoLeak('{"host":"acme-host-7"}', ['Example User', 'acme-host-7', '1']);
    }

    public function test_a_faked_claims_instructions_are_signed_anew_with_the_recordings_instruction_secret(): void
    {
        $instruction = [
            'id' => '00000000000000000000000001',
            'sequence' => 1,
            'type' => 'snapshot',
            'process_id' => '00000000000000000000000002',
            'payload' => '{}',
            'expires_at' => '2026-11-27T08:00:00Z',
            'signature' => 'signed-by-the-real-host-secret',
        ];
        $claim = HostClaimedInstructionsPayload::from([
            'instructions' => [$instruction],
            'idle_window_seconds' => 60,
            'now' => '2026-11-27T07:59:00Z',
        ]);
        $signature = InstructionSignature::of(
            $instruction['id'],
            1,
            'snapshot',
            $instruction['process_id'],
            '{}',
            $instruction['expires_at'],
            RecordingFakes::INSTRUCTION_SECRET,
        );

        $resigned = new RecordingFakes([], [])->resignedClaim($claim);

        $this->assertSame(
            $signature,
            $resigned->instructions[0]->signature,
        );
    }

    /**
     * A terminal plan with the environment and the names it inherits.
     *
     * @param  list<string>  $environment
     * @param  list<string>  $inherit
     */
    private function planWith(array $environment, array $inherit = []): HostProcessPlan
    {
        return new HostProcessPlan(
            HostProcessPurpose::AgentTerminal,
            HostProcessType::Terminal,
            RestartPolicy::Never,
            ['claude'],
            $environment,
            '/workspace',
            inherit: $inherit,
        );
    }

    public function test_a_personal_value_of_the_journal_is_faked_wherever_it_stands(): void
    {
        $fakes = new RecordingFakes([], ['Jane Example-Owner', 'acct-workspace-77']);

        $faked = $fakes->replaceIn('signed in as Jane Example-Owner in acct-workspace-77');

        $this->assertSame('signed in as '.RecordingFakes::USER_NAME.' in '.RecordingFakes::USER_NAME, $faked);
    }
}
