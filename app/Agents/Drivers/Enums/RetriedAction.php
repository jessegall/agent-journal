<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

enum RetriedAction: string
{
    case TurnOpen = 'turn-open';
    case Wake = 'wake';
    case WorkerReport = 'worker-report';
    case Listener = 'listener';

    public function label(): string
    {
        return match ($this) {
            self::TurnOpen => 'Turn open',
            self::Wake => 'Wake',
            self::WorkerReport => 'Worker report',
            self::Listener => 'Listener',
        };
    }
}
