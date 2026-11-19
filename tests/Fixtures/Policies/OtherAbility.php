<?php

declare(strict_types=1);

namespace Tests\Fixtures\Policies;

/**
 * An ability enum whose values equal the Notes module's, to prove a grant names its policy too.
 */
enum OtherAbility: string
{
    case Edit = 'edit';
}
