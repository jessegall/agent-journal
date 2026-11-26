<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

/**
 * How far a prompt typed into a terminal's composer has got.
 */
enum DeliveryStage: string
{
    // The prompt was pasted into the empty composer; its echo has not shown yet.
    case Pasted = 'pasted';
    // The echo showed and Enter was pressed; the composer has not taken the line yet.
    case Entered = 'entered';
}
