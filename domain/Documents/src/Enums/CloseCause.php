<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

/**
 * Why a draft was closed: its author closed it, it was recovered for the author, or its session ended.
 */
enum CloseCause: string
{
    case Author = 'author';
    case Recovery = 'recovery';
    case Lifecycle = 'lifecycle';
}
