<?php

declare(strict_types=1);

namespace App\Communication\Data;

/**
 * What a target resolver answers for a target the actor may still see: its plain-text title and its address.
 */
final readonly class NotificationLink
{
    public function __construct(
        public string $title,
        public string $url,
    ) {}
}
