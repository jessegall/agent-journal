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
        $configured = $this->config->get($place->rootSetting());

        if (! is_string($configured) || $configured === '') {
            return null;
        }

        return $configured;
    }
}
