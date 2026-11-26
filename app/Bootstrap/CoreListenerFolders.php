<?php

declare(strict_types=1);

namespace App\Bootstrap;

use App\Support\CodeFiles;

/**
 * Core's Listeners folders, app/Listeners and the MCP server's own, for the checked listener provider to discover.
 */
final readonly class CoreListenerFolders
{
    private const array FOLDERS = [
        'Listeners',
        'Mcp/Listeners',
    ];

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        $code = CodeFiles::ofProcess();

        return array_map(
            fn (string $folder) => $code->realPathOf($code->projectPathOf(dirname(__DIR__)."/{$folder}")),
            self::FOLDERS,
        );
    }
}
