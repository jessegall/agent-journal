<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook;

use App\Declarations\Page;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Enums\Icon;
use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Modules\Handbook\Http\Pages\EntryPageBuilder;
use Tests\Fixtures\Modules\Handbook\Http\Pages\EntryPageData;
use Tests\Fixtures\Modules\Handbook\Policies\ReadHandbook;

/**
 * An installable package an author writes with no Vue file and no Documents dependency: one entry page declared as a
 * publication layout, opened at /handbook/entries/{entry} or in the inspector.
 */
final class HandbookDomain extends Domain implements PageProvider
{
    public function description(): string
    {
        return 'A handbook of entries: an author example of a publication page built from the shared layout.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function pages(): array
    {
        return [
            Page::build()
                ->key('entry')
                ->title('Handbook entry')
                ->icon(Icon::Docs)
                ->pageType(EntryPageData::class)
                ->pageBuilder(EntryPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('entries/{entry}')
                ->inInspector()
                ->visibleWhen(ReadHandbook::class),
        ];
    }
}
