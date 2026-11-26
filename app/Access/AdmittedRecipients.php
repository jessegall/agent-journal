<?php

declare(strict_types=1);

namespace App\Access;

use App\Messages\Contracts\AdmittedRecipients as AdmittedRecipientsContract;

/**
 * The admitted audience: the configured owner, or nobody when none is configured.
 */
final readonly class AdmittedRecipients implements AdmittedRecipientsContract
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
