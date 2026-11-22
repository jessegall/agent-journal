<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\HostProtocolVersion;
use Tests\TestCase;

final class PublishedReleasesTest extends TestCase
{
    private const string VERSION = '1.0.0';

    private const string BINARY = "\x7fELF journal-agent for linux/amd64";

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$this->folder}/".self::VERSION.'/linux-amd64/bin', 0755, true);
        file_put_contents("{$this->folder}/".self::VERSION.'/manifest.json', $this->manifest());
        file_put_contents("{$this->folder}/".self::VERSION.'/manifest.json.sig', str_repeat("\x01", 64));
        file_put_contents("{$this->folder}/".self::VERSION.'/linux-amd64/bin/journal-agent', self::BINARY);
        file_put_contents("{$this->folder}/".self::VERSION.'/linux-amd64/stray', 'not in the manifest');
        config(['files.places.releases' => $this->folder, 'agents.release' => self::VERSION]);
    }

    public function test_the_current_manifest_and_signature_download_as_their_exact_bytes_and_are_never_cached(): void
    {
        $manifest = $this->get('/releases/current/manifest.json')->assertOk();
        $this->assertSame($this->manifest(), $manifest->streamedContent());
        $this->assertStringContainsString('no-store', (string) $manifest->headers->get('Cache-Control'));

        $signature = $this->get('/releases/current/manifest.json.sig')->assertOk();
        $this->assertSame(str_repeat("\x01", 64), $signature->streamedContent());
        $this->assertStringContainsString('no-store', (string) $signature->headers->get('Cache-Control'));
    }

    public function test_a_binary_downloads_by_version_target_and_name_with_immutable_caching(): void
    {
        $response = $this->get('/releases/1.0.0/linux-amd64/bin/journal-agent')->assertOk();

        $this->assertSame(self::BINARY, $response->streamedContent());
        $cache = (string) $response->headers->get('Cache-Control');
        $this->assertStringContainsString('immutable', $cache);
        $this->assertStringContainsString('max-age=31536000', $cache);
        $this->assertStringContainsString('public', $cache);
    }

    public function test_an_unknown_version_target_or_name_is_a_plain_not_found(): void
    {
        $this->get('/releases/9.9.9/linux-amd64/bin/journal-agent')->assertNotFound();
        $this->get('/releases/1.0.0/windows-amd64/bin/journal-agent')->assertNotFound();
        $this->get('/releases/1.0.0/linux-amd64/stray')->assertNotFound();
        $this->get('/releases/1.0.0/linux-amd64/../manifest.json')->assertNotFound();
    }

    public function test_without_a_published_release_the_manifest_is_not_found(): void
    {
        config(['agents.release' => '']);

        $this->get('/releases/current/manifest.json')->assertNotFound();
        $this->getJson('/releases/compatibility')->assertOk()->assertJsonPath('release', null);
    }

    public function test_the_compatibility_answer_names_the_release_and_every_protocol_version(): void
    {
        $this->getJson('/releases/compatibility')
            ->assertOk()
            ->assertExactJson([
                'release' => self::VERSION,
                'protocolVersions' => [HostProtocolVersion::First->value, HostProtocolVersion::RemoteProject->value],
            ]);
    }

    private function manifest(): string
    {
        return (string) json_encode([
            'version' => self::VERSION,
            'hostProtocolVersion' => HostProtocolVersion::RemoteProject->value,
            'profile' => 'remote-project',
            'providers' => [],
            'targets' => [[
                'os' => 'linux',
                'arch' => 'amd64',
                'artifacts' => [[
                    'name' => 'bin/journal-agent',
                    'source' => 'linux-amd64/bin/journal-agent',
                    'sha256' => hash('sha256', self::BINARY),
                    'size' => strlen(self::BINARY),
                    'executable' => true,
                ]],
            ]],
        ]);
    }
}
