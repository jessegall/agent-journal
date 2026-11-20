<?php

declare(strict_types=1);

namespace App\Mcp\Enums;

enum DiscoveryProfile: string
{
    case MainAgent = 'main-agent';
    case WritingHelper = 'writing-helper';
    case ReadOnlyHelper = 'read-only-helper';

    public function toolLimit(): int
    {
        return match ($this) {
            self::MainAgent => 72,
            self::WritingHelper => 40,
            self::ReadOnlyHelper => 24,
        };
    }

    public function byteLimit(): int
    {
        return match ($this) {
            self::MainAgent => 64 * 1024,
            self::WritingHelper => 40 * 1024,
            self::ReadOnlyHelper => 24 * 1024,
        };
    }

}
