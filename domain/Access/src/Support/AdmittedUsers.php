<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\Messages\AdmittedRecipients;

/**
 * The admitted audience: the configured owner, or nobody when none is configured.
 */
final readonly class AdmittedUsers implements AdmittedRecipients
{
    public function __construct(private AccessSettings $settings) {}

    public function userIds(): array
    {
        return $this->settings->ownerId === null ? [] : [$this->settings->ownerId];
    }
}
