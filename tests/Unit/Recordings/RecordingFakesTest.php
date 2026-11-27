<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Recordings\RecordingFakes;
use PHPUnit\Framework\TestCase;

/**
 * A recording keeps no real value: a folder of the process's environment becomes its variable, an address, a token, an
 * account id, a name and a folder of the user become fakes, and one uuid is one fake throughout a recording.
 */
final class RecordingFakesTest extends TestCase
{
    public function test_a_folder_of_the_environment_becomes_its_variable(): void
    {
        $fakes = new RecordingFakes(['CODEX_HOME' => '/srv/accounts/owner/codex', 'PATH' => '/usr/bin:/bin']);

        $this->assertSame(
            ['{env:CODEX_HOME}/auth.json', '/usr/bin:/bin'],
            [$fakes->replaceIn('/srv/accounts/owner/codex/auth.json'), $fakes->replaceIn('/usr/bin:/bin')],
        );
    }

    public function test_addresses_tokens_and_the_users_folders_become_fakes(): void
    {
        $fakes = new RecordingFakes([]);

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
        $fakes = new RecordingFakes([]);
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
}
