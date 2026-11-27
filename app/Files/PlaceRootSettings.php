<?php

declare(strict_types=1);

namespace App\Files;

use App\Files\Enums\Place;
use Illuminate\Contracts\Config\Repository;

/**
 * The root folder each place's setting names, read when the place is used; none when the setting is empty.
 */
final readonly class PlaceRootSettings
{
    public function __construct(private Repository $config) {}

    public function configuredRoot(Place $place): string|null
    {
        $configured = match ($place) {
            Place::Accounts => $this->config->get('journal.accounts.root'),
            Place::SharingSecrets => $this->config->get('journal.sharing.secrets_dir'),
            Place::SharingTunnels => $this->config->get('journal.sharing.tunnels_dir'),
            Place::ProcessOutput => $this->config->get('filesystems.disks.process-output.root'),
            Place::Project, Place::Temporary, Place::HookRuntime, Place::Releases => $this->config->get(
                "journal.files.places.{$place->value}",
            ),
        };

        if (! is_string($configured) || $configured === '') {
            return null;
        }

        return $configured;
    }
}
