<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

/**
 * What only the owner does with documents and reports: recover a draft, and change a record another actor created.
 */
enum DocumentAbility: string
{
    case Administer = 'administer';
    case ChangeOthersRecords = 'change-others-records';
}
