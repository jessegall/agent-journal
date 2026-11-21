<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Exceptions\FolderClosed;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * A file the user names on the command line is read through its place, read as named outside every place, and
 * refused inside a private place, so a --file argument can never file a secret (story 95).
 */
final class ReadNamedTest extends TestCase
{
    use UsesTemporaryPlaces;

    private string $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        mkdir("{$this->project}/storage/app/private/accounts/a", 0o700, true);
        file_put_contents("{$this->project}/storage/app/private/accounts/a/.credentials.json", '{"secret": true}');
        file_put_contents("{$this->project}/notes.md", 'notes');
        config([
            'accounts.root' => "{$this->project}/storage/app/private/accounts",
            'files.places.temporary' => "{$this->project}/storage",
        ]);
    }

    public function test_a_file_in_an_open_place_is_read_and_a_bounded_read_stops_at_its_limit(): void
    {
        $this->assertSame('notes', $this->files()->readNamed("{$this->project}/notes.md"));
        $this->assertSame('no', $this->files()->readNamedAtMost("{$this->project}/notes.md", 2));
    }

    public function test_a_file_outside_every_place_is_read_as_named(): void
    {
        $outside = sys_get_temp_dir().'/named-outside-'.bin2hex(random_bytes(6));
        file_put_contents($outside, 'mine');

        try {
            $this->assertSame('mine', $this->files()->readNamed($outside));
        } finally {
            unlink($outside);
        }
    }

    public function test_a_file_in_a_private_place_is_refused(): void
    {
        $this->expectExceptionObject(FolderClosed::privatePlace(Place::Accounts));

        $this->files()->readNamed("{$this->project}/storage/app/private/accounts/a/.credentials.json");
    }

    private function files(): Files
    {
        return $this->app->make(Files::class);
    }
}
