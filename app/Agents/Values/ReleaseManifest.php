<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\ReleaseManifestInvalid;
use App\Agents\Exceptions\ReleaseMissing;

/**
 * The files a published journal-agent release holds for each target, read from the manifest journal-release wrote
 * (release.Manifest in tools/journal-agent). Only a file this manifest names is ever served.
 */
final readonly class ReleaseManifest
{
    /**
     * What a release must do before the window offers its install line to the public.
     */
    public const array CAPABILITIES = ['enrollment', 'presence', 'commands', 'child-worktrees'];

    /**
     * @param  array<string, array<string, ReleaseFile>>  $files  by target folder (darwin-arm64), each file by the
     *                                                            name it is installed under
     * @param  list<string>  $capabilities
     * @param  list<ReleaseTarget>  $targets
     */
    private function __construct(
        public string $version,
        public int $protocolVersion,
        private array $files,
        public array $capabilities,
        public array $targets,
    ) {}

    /**
     * @param  array<mixed>  $manifest
     *
     * @throws ReleaseManifestInvalid
     */
    public static function parse(string $version, array $manifest): self
    {
        if (($manifest['version'] ?? null) !== $version) {
            throw ReleaseManifestInvalid::for($version, 'it names another version');
        }

        $files = [];
        $targets = [];

        foreach (self::listAt($version, $manifest, 'targets') as $target) {
            $folder = self::stringAt($version, $target, 'os').'-'.self::stringAt($version, $target, 'arch');
            $bytes = 0;
            $isMeasured = true;

            foreach (self::listAt($version, $target, 'artifacts') as $artifact) {
                $files[$folder][self::stringAt($version, $artifact, 'name')] = new ReleaseFile(
                    self::stringAt($version, $artifact, 'source'),
                    self::stringAt($version, $artifact, 'sha256'),
                );
                $size = $artifact['size'] ?? 0;
                $isMeasured = $isMeasured && is_int($size) && $size > 0;
                $bytes += is_int($size) ? $size : 0;
            }

            $targets[] = new ReleaseTarget(
                $folder,
                $bytes,
                $isMeasured && isset($files[$folder]),
                self::namesAt($version, $target, 'prerequisites'),
                self::namesAt($version, $target, 'providers'),
            );
        }

        $protocolVersion = $manifest['hostProtocolVersion'] ?? null;

        if (! is_int($protocolVersion)) {
            throw ReleaseManifestInvalid::for($version, 'it names no protocol version');
        }

        return new self($version, $protocolVersion, $files, self::namesAt($version, $manifest, 'capabilities'), $targets);
    }

    /**
     * The path inside the release folder of the file the target installs under this name.
     *
     * @throws ReleaseMissing
     */
    public function sourceOf(string $target, string $name): string
    {
        return $this->fileOf($target, $name)->source;
    }

    /**
     * The SHA-256 of a file every target installs alike under this name, such as a shell script.
     *
     * @throws ReleaseMissing
     */
    public function sharedDigestOf(string $name): string
    {
        $digests = [];

        foreach (array_keys($this->files) as $target) {
            $digests[$this->fileOf($target, $name)->sha256] = true;
        }

        if (count($digests) !== 1) {
            throw ReleaseMissing::artifact($this->version, 'every target alike', $name);
        }

        return (string) array_key_first($digests);
    }

    /**
     * Whether the release speaks a protocol this journal speaks.
     */
    public function speaksSpokenProtocol(): bool
    {
        return HostProtocolVersion::tryFrom($this->protocolVersion) !== null;
    }

    /**
     * The capabilities a public install line needs that this release does not have.
     *
     * @return list<string>
     */
    public function withheldCapabilities(): array
    {
        return array_values(array_diff(self::CAPABILITIES, $this->capabilities));
    }

    /**
     * Whether the window may offer this release's install line: it speaks this journal's protocol, has every
     * capability and ships for at least one platform with measured sizes, prerequisites and both providers.
     */
    public function isPublic(): bool
    {
        $supported = array_filter($this->targets, fn (ReleaseTarget $target) => $target->isSupported());

        return $this->speaksSpokenProtocol() && $this->withheldCapabilities() === [] && $supported !== [];
    }

    /**
     * @throws ReleaseMissing
     */
    private function fileOf(string $target, string $name): ReleaseFile
    {
        if (! isset($this->files[$target][$name])) {
            throw ReleaseMissing::artifact($this->version, $target, $name);
        }

        return $this->files[$target][$name];
    }

    /**
     * @param  array<mixed>  $object
     * @return list<array<mixed>>
     *
     * @throws ReleaseManifestInvalid
     */
    private static function listAt(string $version, array $object, string $key): array
    {
        $members = $object[$key] ?? null;

        if (! is_array($members) || ! array_is_list($members)) {
            throw ReleaseManifestInvalid::for($version, "{$key} is not a list");
        }

        $objects = [];

        foreach ($members as $member) {
            if (! is_array($member)) {
                throw ReleaseManifestInvalid::for($version, "an entry of {$key} is not an object");
            }

            $objects[] = $member;
        }

        return $objects;
    }

    /**
     * The names listed under the key; a manifest written before the key existed lists none.
     *
     * @param  array<mixed>  $object
     * @return list<string>
     *
     * @throws ReleaseManifestInvalid
     */
    private static function namesAt(string $version, array $object, string $key): array
    {
        if (! array_key_exists($key, $object)) {
            return [];
        }

        $names = $object[$key];

        if (! is_array($names) || ! array_is_list($names)) {
            throw ReleaseManifestInvalid::for($version, "{$key} is not a list");
        }

        return array_values(array_map(fn (mixed $name) => is_string($name) && $name !== ''
            ? $name
            : throw ReleaseManifestInvalid::for($version, "an entry of {$key} is not a name"), $names));
    }

    /**
     * @param  array<mixed>  $object
     *
     * @throws ReleaseManifestInvalid
     */
    private static function stringAt(string $version, array $object, string $key): string
    {
        $name = $object[$key] ?? null;

        if (! is_string($name) || $name === '') {
            throw ReleaseManifestInvalid::for($version, "{$key} is not a name");
        }

        return $name;
    }
}
