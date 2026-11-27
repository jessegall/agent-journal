<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Declarations\Page;
use App\Declarations\PageLoaders;
use App\Http\Responses\LoaderProps;
use App\Inboxes\Contracts\InboxMemberRoutes;
use App\Navigation\Contracts\ClientOwnerAvailability;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Loader;
use App\Navigation\Enums\Icon;
use App\Notifications\Exceptions\NotificationCursorInvalid;
use App\Support\ActorReference;
use App\Support\ClientDeclarations;
use App\Support\DomainEntry;
use App\Values\InboxMemberAuthority;
use App\Web\Exceptions\LoaderInputUnreadable;
use Illuminate\Http\Request;
use RuntimeException;
use Tests\Fixtures\ClientDeclarations\Library\BooksResolver;
use Tests\Fixtures\ClientDeclarations\Library\LibraryDomain;
use Tests\Fixtures\ClientDeclarations\Library\NobodySees;
use Tests\Fixtures\ClientDeclarations\Library\RefusingLoader;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsData;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsInput;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsLoader;
use Tests\TestCase;

/**
 * The loader call a partial reload names is answered in the shared props: nothing without its header, a bad request
 * for an unreadable input, the same unavailable answer for every viewer or key that may not call it, the field errors
 * of an invalid input without the reader, and the reader's answer under the loader's prop. It reads no database.
 */
final class LoaderPropsTest extends TestCase
{
    private const string OWNER = 'user-1';

    private bool $isLibraryOn = true;

    protected function setUp(): void
    {
        parent::setUp();

        $library = DomainEntry::fromClass(LibraryDomain::class);
        $this->app->instance(ClientDeclarations::class, ClientDeclarations::check([$library->declaring(
            pages: [
                Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Books.vue')
                    ->at('')
                    ->loaders(fn (PageLoaders $loaders) => $loaders->add('shelf-rows', ShelfRowsLoader::class)),
                Page::make('book', 'Book', Icon::Docs, BooksResolver::class, 'Book/Reader.vue')
                    ->at('{book}')
                    ->visibleWhen(NobodySees::class)
                    ->loaders(fn (PageLoaders $loaders) => $loaders->add('hidden-rows', ShelfRowsLoader::class)),
            ],
            types: [ShelfRowsInput::class, ShelfRowsData::class],
            loaders: [Loader::make('refusing', RefusingLoader::class)],
        )]));
        $this->app->instance(ClientOwnerAvailability::class, new class($this) implements ClientOwnerAvailability
        {
            public function __construct(private readonly LoaderPropsTest $test) {}

            public function isAvailable(DomainClient $owner): bool
            {
                return $this->test->isLibraryOn();
            }
        });
        $this->app->make(InboxMemberRoutes::class)->open('library.shelf');
        $this->actAs(new OwnerAuthority('test'));
    }

    public function isLibraryOn(): bool
    {
        return $this->isLibraryOn;
    }

    public function test_a_request_without_the_header_gets_nothing(): void
    {
        $this->assertSame([], $this->loaders()->of(Request::create('/')));
    }

    public function test_an_unreadable_input_is_a_bad_request(): void
    {
        $request = Request::create('/', server: ['HTTP_X_JOURNAL_LOADER' => 'library.shelf-rows']);

        $this->expectExceptionObject(LoaderInputUnreadable::notEncoded());

        $this->loaders()->of($request);
    }

    public function test_the_reader_answers_under_the_loaders_prop(): void
    {
        $this->assertSame(
            ['load_library_shelf_rows' => ['token' => 't1', 'status' => 'ok', 'value' => ['titles' => ['s-1']]]],
            $this->answered('library.shelf-rows', ['shelfId' => 's-1']),
        );
    }

    public function test_every_call_the_viewer_may_not_make_is_unavailable_alike(): void
    {
        $unavailable = ['loaderFailure' => ['token' => 't1', 'status' => 'unavailable']];

        $this->assertSame($unavailable, $this->answered('library.unknown', ['shelfId' => 's-1']));
        $this->assertSame($unavailable, $this->answered('library.hidden-rows', ['shelfId' => 's-1']));

        $this->isLibraryOn = false;
        $this->assertSame($unavailable, $this->answered('library.shelf-rows', ['shelfId' => 's-1']));
        $this->isLibraryOn = true;

        $this->app->make(CurrentActorSetter::class)->clear();
        $this->assertSame($unavailable, $this->answered('library.shelf-rows', ['shelfId' => 's-1']));

        $this->actAs(new InboxMemberAuthority('test'));
        $this->assertSame($unavailable, $this->answered('library.refusing', ['shelfId' => 's-1']));
        $this->assertArrayHasKey(
            'load_library_shelf_rows',
            $this->answered('library.shelf-rows', ['shelfId' => 's-1']),
        );
    }

    public function test_an_invalid_input_gives_its_field_errors_and_the_reader_is_not_called(): void
    {
        $answer = $this->answered('library.refusing', []);

        $this->assertSame(['token', 'status', 'errors'], array_keys($answer['loaderFailure']));
        $this->assertSame('invalid', $answer['loaderFailure']['status']);
        $this->assertArrayHasKey('shelfId', $answer['loaderFailure']['errors']);
    }

    public function test_a_field_the_reader_refuses_is_invalid_with_its_message(): void
    {
        $this->assertSame(
            ['loaderFailure' => [
                'token' => 't1',
                'status' => 'invalid',
                'errors' => ['cursor' => NotificationCursorInvalid::create()->getMessage()],
            ]],
            $this->answered('library.refusing', ['shelfId' => 'bad-cursor']),
        );
    }

    public function test_a_refusal_or_a_missing_row_or_page_from_the_reader_is_unavailable_and_a_fault_is_not(): void
    {
        $unavailable = ['loaderFailure' => ['token' => 't1', 'status' => 'unavailable']];

        $this->assertSame($unavailable, $this->answered('library.refusing', ['shelfId' => 'refused']));
        $this->assertSame($unavailable, $this->answered('library.refusing', ['shelfId' => 'no-row']));
        $this->assertSame($unavailable, $this->answered('library.refusing', ['shelfId' => 'no-page']));

        $this->expectExceptionObject(new RuntimeException('The shelf broke.'));

        $this->answered('library.refusing', ['shelfId' => 'broken']);
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    private function answered(string $key, array $input): array
    {
        $json = (string) json_encode(['token' => 't1', 'input' => $input]);
        $header = rtrim(strtr(base64_encode($json), '+/', '-_'), '=');
        $request = Request::create('/', server: [
            'HTTP_X_JOURNAL_LOADER' => $key,
            'HTTP_X_JOURNAL_LOADER_INPUT' => $header,
        ]);

        return array_map(fn ($reply) => $reply->toArray(), $this->loaders()->of($request));
    }

    private function loaders(): LoaderProps
    {
        return $this->app->make(LoaderProps::class);
    }

    private function actAs(OwnerAuthority|InboxMemberAuthority $authority): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser(self::OWNER), $authority);
    }
}
