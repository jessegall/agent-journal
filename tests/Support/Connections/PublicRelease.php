<?php

declare(strict_types=1);

namespace Tests\Support\Connections;

use App\Values\ReleaseManifest;
use App\Values\ReleaseTarget;

/**
 * The manifest of a release the window may offer to the public: every capability, and one platform with measured
 * files, its prerequisites and both local providers.
 */
final class PublicRelease
{
    /**
     * @return array<string, mixed>
     */
    public static function manifest(string $version, int $protocolVersion): array
    {
        return [
            'version' => $version,
            'hostProtocolVersion' => $protocolVersion,
            'capabilities' => ReleaseManifest::REQUIRED_CAPABILITIES,
            'targets' => [[
                'os' => 'darwin',
                'arch' => 'arm64',
                'prerequisites' => ['git', 'curl'],
                'providers' => ReleaseTarget::REQUIRED_PROVIDERS,
                'artifacts' => [[
                    'name' => 'bin/journal-agent',
                    'source' => 'darwin-arm64/bin/journal-agent',
                    'sha256' => str_repeat('a', 64),
                    'size' => 9_000_000,
                    'executable' => true,
                ]],
            ]],
        ];
    }
}
