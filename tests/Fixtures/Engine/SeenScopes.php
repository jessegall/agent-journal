<?php

declare(strict_types=1);

namespace Tests\Fixtures\Engine;

use App\Support\EngineAccess;

/**
 * Which of the named maintenance scopes the engine access allows right now.
 */
final class SeenScopes
{
    /**
     * @param  list<string>  $scopes
     * @return list<string>
     */
    public static function of(EngineAccess $access, array $scopes): array
    {
        return array_values(array_filter($scopes, $access->allowsMaintenance(...)));
    }
}
