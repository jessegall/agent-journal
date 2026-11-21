<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The Connect a project window: the server a line connects to, whether it may issue lines now, and every connected
 * folder. An issued line is never part of it, so it never enters the page's history.
 */
#[TypeScript]
final class ConnectProjectWindowData extends Data
{
    /**
     * @param  list<ProjectBindingRowData>  $bindings
     */
    public function __construct(
        public readonly string $serverName,
        public readonly bool $canIssue,
        #[DataCollectionOf(ProjectBindingRowData::class)]
        public readonly array $bindings,
    ) {}
}
