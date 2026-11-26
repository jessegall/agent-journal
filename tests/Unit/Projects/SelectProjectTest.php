<?php

declare(strict_types=1);

namespace Tests\Unit\Projects;

use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Projects\AgentProjects;
use App\Contracts\Projects\ProjectDirectory;
use App\Exceptions\ProjectUnavailable;
use App\Http\Middleware\Web\SelectProject;
use App\Support\ActorReference;
use App\Support\ActorStore;
use App\Support\Projects\CurrentProject;
use App\Values\InboxMemberAuthority;
use App\Values\OwnerAuthority;
use App\Values\ProjectSelection;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\Projects\BuildsCurrentProject;

/**
 * The eight inputs of a browser's project choice: the header, the query, both agreeing, both disagreeing, a malformed
 * id, a project not listed, a guest's choice and no choice, each with its one answer.
 */
final class SelectProjectTest extends TestCase
{
    use BuildsCurrentProject;

    public const string LISTED = '01jd8x0g9m3qz6v4k2t7r5w1cc';

    private const string UNLISTED = '01jd8x0g9m3qz6v4k2t7r5w1cd';

    private const string USER = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    private ActorStore $actors;

    private CurrentProject $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actors = new ActorStore();
        $admission = $this->createStub(JournalAdmission::class);
        $admission->method('admits')->willReturn(true);
        $this->store = $this->currentProject($this->actors, $this->createStub(AgentProjects::class), $admission);
        $this->actors->set(ActorReference::forUser(self::USER), new OwnerAuthority('web'));
    }

    /**
     * @return iterable<string, array{array<string, string>, array<string, string>}>
     */
    public static function chosenInputs(): iterable
    {
        yield 'the header' => [[SelectProject::HEADER => self::LISTED], []];

        yield 'the query' => [[], [ProjectSelection::ADDRESS_PARAMETER => self::LISTED]];

        yield 'both agreeing' => [
            [SelectProject::HEADER => self::LISTED],
            [ProjectSelection::ADDRESS_PARAMETER => self::LISTED],
        ];
    }

    /**
     * @param  array<string, string>  $headers
     * @param  array<string, string>  $query
     */
    #[DataProvider('chosenInputs')]
    public function test_a_valid_choice_installs_its_project(array $headers, array $query): void
    {
        $this->handle($headers, $query);

        $this->assertEquals(ProjectSelection::of(self::LISTED), $this->store->selection());
    }

    /**
     * @return iterable<string, array{array<string, string>, array<string, string>}>
     */
    public static function refusedInputs(): iterable
    {
        yield 'both disagreeing' => [
            [SelectProject::HEADER => self::LISTED],
            [ProjectSelection::ADDRESS_PARAMETER => self::UNLISTED],
        ];

        yield 'a malformed id' => [[SelectProject::HEADER => 'not-a-project'], []];

        yield 'a project not listed' => [[], [ProjectSelection::ADDRESS_PARAMETER => self::UNLISTED]];
    }

    /**
     * @param  array<string, string>  $headers
     * @param  array<string, string>  $query
     */
    #[DataProvider('refusedInputs')]
    public function test_a_choice_the_browser_may_not_make_is_unavailable(array $headers, array $query): void
    {
        $this->expectException(ProjectUnavailable::class);

        $this->handle($headers, $query);
    }

    public function test_a_guest_choosing_a_listed_project_is_refused_alike(): void
    {
        $this->actors->set(ActorReference::forUser(self::USER), new InboxMemberAuthority('web'));

        $this->expectException(ProjectUnavailable::class);

        $this->handle([SelectProject::HEADER => self::LISTED], []);
    }

    public function test_no_choice_leaves_the_owner_on_all_projects(): void
    {
        $this->handle([], []);

        $this->assertEquals(ProjectSelection::all(), $this->store->selection());
    }

    /**
     * @param  array<string, string>  $headers
     * @param  array<string, string>  $query
     */
    private function handle(array $headers, array $query): void
    {
        $request = Request::create('/tasks', 'GET', $query);

        foreach ($headers as $name => $value) {
            $request->headers->set($name, $value);
        }

        $middleware = new SelectProject($this->directory(), $this->store, $this->actors);
        $middleware->handle($request, fn (): Response => new Response());
    }

    private function directory(): ProjectDirectory
    {
        return new class implements ProjectDirectory
        {
            public function isListed(string $id): bool
            {
                return $id === SelectProjectTest::LISTED;
            }

            public function listed(): array
            {
                return [];
            }
        };
    }
}
