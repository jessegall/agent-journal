<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Desk;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Declarations\Section;
use App\Ui\Enums\SlotContextType;

/**
 * A fixture domain that declares no page and fills the slots of the Library fixture's pages.
 */
final class DeskDomain extends Domain implements SectionProvider
{
    public function description(): string
    {
        return 'A fixture domain that declares sections only.';
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

    public function sections(): array
    {
        return [
            Section::make(
                'notes',
                'Notes',
                'library.book-inspector',
                SlotContextType::Record,
                NotesResolver::class,
                'Notes.vue',
            ),
            Section::make(
                'draft',
                'Draft',
                'library.aside',
                SlotContextType::Session,
                NotesResolver::class,
                'Notes.vue',
            ),
        ];
    }
}
