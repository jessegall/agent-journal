<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Messages\AdmittedRecipients;

/**
 * The admitted audience: the configured owner, or nobody when none is configured.
 */
final readonly class AdmittedUsers implements AdmittedRecipients
{
    public function __construct(private AccessSettings $settings) {}

    public function userIds(): array
    {
        if ($this->settings->ownerId === null) {
            return [];
        }

        return [$this->settings->ownerId];
    }
}
