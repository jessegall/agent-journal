<?php

declare(strict_types=1);

namespace Tests\Support\Connections;

use App\Commands\Settings\SetBooleanSetting\SetBooleanSettingCommand;
use App\Models\Access\User;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\ProjectInvitation;
use App\Support\SignedCall;
use App\Values\InstallTicket;
use App\Values\SettingReference;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;

/**
 * A server that issues install lines: an owner, connecting switched on, an https origin and a published release; and
 * a relay's redemption of a line, its credential made from its nonce.
 */
trait ConnectsProjects
{
    use IssuesInstallLines;

    private User $owner;

    /**
     * The tables a redemption also writes, giving the project's main agent its desk; they are emptied around each test.
     */
    private const array DESK_TABLES = ['inboxes', 'inbox_members', 'assignments'];

    protected function setUpConnectsProjects(): void
    {
        $this->emptyTables(...self::DESK_TABLES);
        $this->owner = $this->journal->owner()->ownerUser();
        $folder = sys_get_temp_dir().'/connections-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/1.0.0", 0755, true);
        file_put_contents("{$folder}/1.0.0/manifest.json", (string) json_encode(PublicRelease::manifest('1.0.0')));
        config([
            'files.places.releases' => $folder,
            'agents.release' => '1.0.0',
            'agents.server_origin' => 'https://journal.example.com',
        ]);
        $this->journal->asOwner(
            new SetBooleanSettingCommand(new SettingReference('Core', 'remote_projects'), true, 0),
        );
    }

    private function issueLine(string $ticket): ProjectInvitation
    {
        return ProjectInvitation::create(
            InstallAttempt::create($this->owner->id, 'action-'.bin2hex(random_bytes(4)), null),
            InstallTicket::digestOf($ticket),
        );
    }

    private function redeemLine(string $ticket, string $nonce): TestResponse
    {
        return $this->postJson(
            'https://localhost/api/project-connections/redeem',
            $this->redemptionBody($ticket, $nonce),
        );
    }

    /**
     * The credential a relay of this nonce signs with.
     */
    private function relayCredential(string $nonce): string
    {
        return "relay-credential-{$nonce}-".str_repeat('x', 16);
    }

    /**
     * @return array<string, string|int>
     */
    private function redemptionBody(string $ticket, string $nonce): array
    {
        return [
            'ticket' => $ticket,
            'installationNonce' => $nonce,
            'hostCredential' => $this->relayCredential($nonce),
            'rootId' => 'root-'.bin2hex(random_bytes(4)),
            'canonicalRoot' => '/Users/owner/shop',
            'projectLabel' => 'Shop',
            'machineLabel' => 'Owner laptop',
        ];
    }

    /**
     * A call signed with a relay's credential, as its host signs every call, speaking the given protocol.
     *
     * @param  array<string, mixed>  $body
     */
    private function signedRelayCall(
        string $credential,
        string $target,
        array $body,
        string $callId,
    ): TestResponse {
        $content = (string) json_encode((object) $body);
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        // A relay's call carries no user's session.
        $this->app['auth']->forgetGuards();
        $this->app->forgetScopedInstances();

        return $this->call('POST', 'https://localhost'.$target, server: [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => "Bearer {$credential}",
            $this->serverHeader(SignedCall::ID_HEADER) => $callId,
            $this->serverHeader(SignedCall::ISSUED_AT_HEADER) => (string) $issuedAt,
            $this->serverHeader(SignedCall::SIGNATURE_HEADER) => SignedCall::signatureFor(
                $credential,
                'POST',
                $target,
                $callId,
                $issuedAt,
                $content,
            ),
        ], content: $content);
    }

    /**
     * Reports the binding's relay present on a set-up folder and reconciled, as a relay that set its folder up does.
     */
    private function notifyClaudeCode(string $nonce, string $bindingId): void
    {
        $this->notifyPresence($nonce, $bindingId);
    }

    /**
     * Reports the binding's relay present on a set-up folder and reconciled.
     */
    private function notifyPresence(string $nonce, string $bindingId): void
    {
        $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$bindingId}/presence",
            [
                'bootId' => 'boot-'.$nonce,
                'sequence' => 1,
                'release' => '1.0.0',
                'provisioning' => 'succeeded',
                'isTakeover' => false,
                'setupGeneration' => 1,
                'isReconciled' => true,
            ],
            (string) Str::uuid(),
        )->assertOk();
    }

    private function serverHeader(string $name): string
    {
        return 'HTTP_'.strtoupper(str_replace('-', '_', $name));
    }

    protected function tearDownConnectsProjects(): void
    {
        $this->emptyTables(...self::DESK_TABLES);
    }
}
