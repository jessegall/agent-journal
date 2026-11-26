<?php

declare(strict_types=1);

namespace Tests\Unit\Client;

use App\Exceptions\ClientKeyRepeated;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Loader;
use App\Navigation\Exceptions\ClientResolverInvalid;
use App\Support\ClientDeclarations;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\ClientDeclarations\Library\BorrowedAnswerLoader;
use Tests\Fixtures\ClientDeclarations\Library\InputlessLoader;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsData;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsInput;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsLoader;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;

/**
 * A loader is checked at start-up with the other declarations: its key once within its owner, its browser prop once
 * among every prop, and its reader an invokable of the owner taking one of the owner's Data and answering another.
 */
final class LoaderDeclarationsTest extends TestCase
{
    private const string NAMESPACE = 'Tests\\Fixtures\\ClientDeclarations\\Library';

    public function test_a_loader_is_registered_with_its_key_prop_reader_and_data(): void
    {
        $declarations = ClientDeclarations::check([
            $this->owner('Library', Loader::make('shelf-rows', ShelfRowsLoader::class)),
        ]);

        $loader = $declarations->loader('library.shelf-rows')->get();

        $this->assertSame(
            ['library.shelf-rows', 'load_library_shelf_rows', ShelfRowsInput::class, ShelfRowsData::class, null],
            [$loader->key, $loader->prop, $loader->inputClass, $loader->answerClass, $loader->guardKey],
        );
        $this->assertTrue($declarations->loader('library.unknown')->isEmpty());
    }

    public function test_a_key_declared_twice_by_one_owner_is_refused(): void
    {
        $this->expectExceptionObject(ClientKeyRepeated::inDomain('Library', 'loader', 'shelf-rows'));

        ClientDeclarations::check([$this->owner(
            'Library',
            Loader::make('shelf-rows', ShelfRowsLoader::class),
            Loader::make('shelf-rows', ShelfRowsLoader::class),
        )]);
    }

    public function test_two_loaders_whose_props_come_out_the_same_are_refused_naming_both(): void
    {
        $this->expectExceptionObject(
            ClientKeyRepeated::propName('load_library_rows_shelf', 'library.rows-shelf', 'library-rows.shelf'),
        );

        ClientDeclarations::check([
            $this->owner('Library', Loader::make('rows-shelf', ShelfRowsLoader::class)),
            $this->owner('LibraryRows', Loader::make('shelf', ShelfRowsLoader::class)),
        ]);
    }

    public function test_a_reader_that_takes_no_input_data_is_refused(): void
    {
        $this->expectExceptionObject(ClientResolverInvalid::loaderShape('library.inputless', InputlessLoader::class));

        ClientDeclarations::check([$this->owner('Library', Loader::make('inputless', InputlessLoader::class))]);
    }

    public function test_a_reader_answering_another_owners_data_is_refused(): void
    {
        $this->expectExceptionObject(
            ClientResolverInvalid::loaderTypeNotOwned('library.borrowed', RecentNotesData::class, 'Library'),
        );

        ClientDeclarations::check([$this->owner('Library', Loader::make('borrowed', BorrowedAnswerLoader::class))]);
    }

    public function test_a_reader_outside_the_owner_is_refused(): void
    {
        $this->expectExceptionObject(ClientResolverInvalid::loaderNotOwned('desk.rows', ShelfRowsLoader::class));

        ClientDeclarations::check([DomainClient::declaring(
            'Desk',
            'Tests\\Fixtures\\ClientDeclarations\\Desk',
            __DIR__,
            loaders: [Loader::make('rows', ShelfRowsLoader::class)],
        )]);
    }

    private function owner(string $name, Loader ...$loaders): DomainClient
    {
        return DomainClient::declaring(
            $name,
            self::NAMESPACE,
            __DIR__,
            types: [ShelfRowsInput::class, ShelfRowsData::class],
            loaders: array_values($loaders),
        );
    }
}
