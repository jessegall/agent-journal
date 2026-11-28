<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Navigation\Declarations\DomainClient;
use App\Support\DomainEntry;
use App\Web\Creation\DeclaredSurfaceCheck;
use App\Web\Creation\Exceptions\InvalidSurface;
use App\Web\Creation\PageFactory;
use App\Web\Creation\SurfaceDefinition;
use App\Web\Creation\WindowFactory;
use Domain\Rules\RulesDomain;
use Illuminate\Container\Container;
use Tests\Fixtures\Modules\Handbook\HandbookDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Web\Types\BookData;
use Tests\Fixtures\Web\Types\BookPageBuilder;
use Tests\Fixtures\Web\Types\ShelfPage;
use Tests\TestCase;

final class DeclaredSurfaceCheckTest extends TestCase
{
    protected static function bootedDomains(): array
    {
        // The notes module requires the rules domain, which its entry checks as it is read.
        return [RulesDomain::class];
    }

    public function test_registration_reads_the_concrete_return_without_resolving_the_builder(): void
    {
        $pages = new PageFactory();
        $check = new DeclaredSurfaceCheck($pages, new WindowFactory());

        $check->registerPage($this->library(), 'library.book', $this->book());

        $this->assertSame(BookPageBuilder::class, $pages->builderFor(BookData::class));
        $this->assertFalse(Container::getInstance()->resolved(BookPageBuilder::class));
    }

    public function test_a_repeat_names_the_declaration_and_type(): void
    {
        $check = $this->collector();
        $library = $this->library();
        $check->registerPage($library, 'library.book', $this->book());
        $this->expectExceptionObject(InvalidSurface::repeatedType('library.book-copy', BookData::class));

        $check->registerPage($library, 'library.book-copy', $this->book());
    }

    public function test_a_non_exact_declared_build_return_is_refused(): void
    {
        $this->expectExceptionObject(InvalidSurface::builder('library.shelf', BookPageBuilder::class, ShelfPage::class));

        $this->collector()->registerPage(
            $this->library(),
            'library.shelf',
            new SurfaceDefinition(ShelfPage::class, BookPageBuilder::class, DomainClient::DECLARED_LAYOUT),
        );
    }

    public function test_independent_domain_owners_cannot_claim_a_foreign_pair(): void
    {
        $notes = DomainEntry::fromClass(NotesDomain::class)->declaring();
        $handbook = DomainEntry::fromClass(HandbookDomain::class)->declaring();
        $this->assertFalse($notes->owns(HandbookDomain::class));
        $this->assertFalse($handbook->owns(NotesDomain::class));
        $this->expectExceptionObject(InvalidSurface::unowned('notes.book', BookData::class, BookPageBuilder::class));

        $this->collector()->registerPage($notes, 'notes.book', $this->book());
    }

    private function collector(): DeclaredSurfaceCheck
    {
        return new DeclaredSurfaceCheck(new PageFactory(), new WindowFactory());
    }

    private function library(): DomainClient
    {
        return DomainClient::declaring('Library', 'Tests\Fixtures\Web\Types', __DIR__);
    }

    private function book(): SurfaceDefinition
    {
        return new SurfaceDefinition(BookData::class, BookPageBuilder::class, DomainClient::DECLARED_LAYOUT);
    }
}
