<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Enums;

use App\Contracts\ChoiceLabel;

enum ReviewMode: string implements ChoiceLabel
{
    case Quick = 'quick';
    case Thorough = 'thorough';

    public function label(): string
    {
        return match ($this) {
            self::Quick => 'A quick look',
            self::Thorough => 'A thorough review',
        };
    }
}
