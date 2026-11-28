<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Web\Attributes\Deferred;
use App\Web\Attributes\Live;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's open account notices, shown in the bar of every page.
 */
#[TypeScript]
#[Deferred('section_web_bar_accounts_notices'), Live]
final class AccountNoticesData extends Data
{
    /**
     * @param  list<AccountNoticeData>  $notices
     */
    public function __construct(
        #[DataCollectionOf(AccountNoticeData::class)]
        public readonly array $notices,
    ) {}
}
