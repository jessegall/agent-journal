<?php

declare(strict_types=1);

namespace Tests\Support\Connections;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Enums\HostProtocolVersion;
use App\Bus\Contracts\CommandBus;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Values\InstallTicket;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Values\SettingReference;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Testing\TestResponse;

/**
 * A server that issues install lines: an owner, connecting switched on, an https origin and a published release; and
 * a relay's redemption of a line, its credential made from its nonce.
 */
trait ConnectsProjects
{
    private User $owner;

    protected function setUpConnectsProjects(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $folder = sys_get_temp_dir().'/connections-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/1.0.0", 0755, true);
        file_put_contents("{$folder}/1.0.0/manifest.json", (string) json_encode([
            'version' => '1.0.0',
            'hostProtocolVersion' => HostProtocolVersion::RemoteProject->value,
            'targets' => [],
        ]));
        config([
            'files.places.releases' => $folder,
            'agents.release' => '1.0.0',
            'agents.server_origin' => 'https://journal.example.com',
        ]);
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        $this->app->make(CommandBus::class)->run(
            new SetBooleanSetting(new SettingReference('Core', 'remote_projects'), true, 0),
        );
        $this->app->forgetScopedInstances();
    }

    private function issueLine(string $ticket): ProjectInvitation
    {
        return ProjectInvitation::issueForNewProject(
            InstallTicket::digestOf($ticket),
            $this->owner->id,
            'action-'.bin2hex(random_bytes(4)),
        );
    }

    private function redeemLine(string $ticket, string $nonce): TestResponse
    {
        return $this->postJson('https://localhost/api/project-connections/redeem', $this->redemptionBody($ticket, $nonce));
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
            'protocol' => HostProtocolVersion::RemoteProject->value,
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
        HostProtocolVersion $protocol,
        string $callId,
    ): TestResponse {
        $content = (string) json_encode((object) $body);
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $this->app->forgetScopedInstances();

        return $this->call('POST', 'https://localhost'.$target, server: [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => "Bearer {$credential}",
            $this->serverHeader(SignedCall::HOST_PROTOCOL_HEADER) => (string) $protocol->value,
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

    private function serverHeader(string $name): string
    {
        return 'HTTP_'.strtoupper(str_replace('-', '_', $name));
    }
}
