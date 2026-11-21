<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * The business event a notification comes from.
 */
enum NotificationSourceType: string
{
    case Question = 'question';
    case Report = 'report';
}
