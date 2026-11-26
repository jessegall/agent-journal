<?php

declare(strict_types=1);

namespace App\Connections\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The Connect a project window: the server a line connects to, by name and origin, whether it may issue lines now,
 * what the current release offers, the projects a Join line can join, the owner's install attempts, and every
 * connected folder. An issued line is never part of it, so it never enters the page's history.
 */
#[TypeScript]
final class ConnectProjectWindowData extends Data
{
    /**
     * @param  list<string>  $holdReasons  why the server issues no install line now, one sentence each
     * @param  list<JoinTargetData>  $projects
     */
    public function __construct(
        public readonly string $serverName,
        public readonly string $origin,
        public readonly bool $canIssue,
        public readonly array $holdReasons,
        public readonly ReleaseOfferData $release,
        #[DataCollectionOf(JoinTargetData::class)]
        public readonly array $projects,
        public readonly InstallAttemptListData $attempts,
        public readonly BindingListData $bindings,
    ) {}
}
