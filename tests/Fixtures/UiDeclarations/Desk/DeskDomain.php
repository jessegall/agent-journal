<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Desk;

use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesSections;
use App\Domain\Declarations\Section;
use App\Domain\Enums\SlotContextKind;

/**
 * A fixture domain that declares no page and fills the slots of the Library fixture's pages.
 */
final class DeskDomain implements Domain, ProvidesSections
{
    public function description(): string
    {
        return 'A fixture domain that declares sections only.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): array
    {
        return [];
    }

    public function sections(): array
    {
        return [
            Section::make('notes', 'Notes', 'library.book-inspector', SlotContextKind::Record, NotesReader::class, 'Notes.vue'),
            Section::make('draft', 'Draft', 'library.aside', SlotContextKind::Session, NotesReader::class, 'Notes.vue'),
        ];
    }
}
