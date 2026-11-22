<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The project folder a relay redeems an install line for: the opaque id it names the folder by, the folder's
 * canonical path, which never reaches a label or a log, the machine's label and the installation's one-time nonce.
 */
final readonly class BindingFolder
{
    public function __construct(
        public string $rootId,
        public string $canonicalRoot,
        public string $machineLabel,
        public string $installationNonce,
    ) {}
}
