<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\RevokeProjectInvitation\RevokeProjectInvitationCommand;
use App\Commands\Settings\SetBooleanSetting\SetBooleanSettingCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\ReleaseManifest;
use App\Values\ReleaseTarget;
use App\Values\SettingReference;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\IssuesInstallLines;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A revoked install line answers the generic failure.
 */
#[TestsCommand(RevokeProjectInvitationCommand::class)]
final class RevokeProjectInvitationTest extends TestCase
{
    use CommitsHookRows;
    use IssuesInstallLines;

    private const string UNUSABLE_LINE = 'journal: this install line cannot be used. '
        ."Copy a new one from the journal.\n";

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'projects',
        'settings_records', 'users',
    ];

    private const string VERSION = '1.0.0';

    private const string LINE = '#\Acurl -fsSL https://journal\.example\.com/install/([A-Za-z0-9_-]{43}) \| sh\z#';

    /**
     * @var list<string>
     */
    private array $logLines = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->publishRelease();
        config(['agents.server_origin' => 'https://journal.example.com']);
        Event::listen(MessageLogged::class, function (MessageLogged $logged): void {
            $this->logLines[] = $logged->message.' '.json_encode($logged->context);
        });
    }

    public function test_a_revoked_line_answers_the_generic_failure(): void
    {
        $this->switchOn();
        $response = $this->issue('action-1');
        $ticket = $this->ticketOf($response);

        $this->actingAs($this->journal->ownerUser())
            ->deleteJson('/project-connections/invitations/'.$response['invitationId'])
            ->assertNoContent();

        $this->assertSame(
            self::UNUSABLE_LINE,
            $this->get("/install/{$ticket}")->assertNotFound()->getContent(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function issue(string $issuanceKey): array
    {
        return $this->issuedLine(['issuanceKey' => $issuanceKey]);
    }

    /**
     * @param  array<string, mixed>  $issued
     */
    private function ticketOf(array $issued): string
    {
        $this->assertMatchesRegularExpression(self::LINE, (string) $issued['installLine']);
        preg_match(self::LINE, (string) $issued['installLine'], $match);

        return $match[1];
    }

    private function switchOn(): void
    {
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(CommandBus::class)->run(
            new SetBooleanSettingCommand(new SettingReference('Core', 'remote_projects'), true, 0),
        );
        $this->app->forgetScopedInstances();
    }

    private function publishRelease(): void
    {
        $folder = sys_get_temp_dir().'/install-lines-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        $relay = fn (string $target) => [
            'name' => 'scripts/install-relay.sh',
            'source' => "{$target}/scripts/install-relay.sh",
            'sha256' => str_repeat('ab', 32),
            'size' => 10,
            'executable' => false,
        ];
        file_put_contents("{$folder}/".self::VERSION.'/manifest.json', (string) json_encode([
            'version' => self::VERSION,
            'capabilities' => ReleaseManifest::REQUIRED_CAPABILITIES,
            'targets' => [[
                'os' => 'linux',
                'arch' => 'amd64',
                'prerequisites' => ['git', 'curl'],
                'providers' => ReleaseTarget::REQUIRED_PROVIDERS,
                'artifacts' => [$relay('linux-amd64')],
            ]],
        ]));
        config(['files.places.releases' => $folder, 'agents.release' => self::VERSION]);
    }
}
