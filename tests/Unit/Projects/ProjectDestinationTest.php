<?php

declare(strict_types=1);

namespace Tests\Unit\Projects;

use App\Contracts\Projects\CurrentProject;
use App\Contracts\Projects\ProjectDestination as ProjectDestinationContract;
use App\Exceptions\ProjectNotChosen;
use App\Support\Projects\ProjectDestination;
use App\Values\ProjectOwner;
use App\Values\ProjectSelection;
use PhpOption\None;
use PhpOption\Some;
use PHPUnit\Framework\TestCase;

/**
 * A create goes to the project its sender chose, else the selected one: an agent's or a browser's on one project;
 * All projects without a choice is refused, and Global is a choice of its own.
 */
final class ProjectDestinationTest extends TestCase
{
    private const string PROJECT = 'project-a';

    private const string OTHER = 'project-b';

    public function test_one_selected_project_is_the_destination_when_nothing_was_chosen(): void
    {
        $destination = $this->destination(ProjectSelection::of(self::PROJECT));

        $this->assertSame(self::PROJECT, $destination->projectFor(None::create()));
        $this->assertEquals(ProjectOwner::ofProject(self::PROJECT), $destination->ownerFor(None::create()));
    }

    public function test_a_choice_names_the_destination_under_all_projects(): void
    {
        $destination = $this->destination(ProjectSelection::all());

        $this->assertSame(self::OTHER, $destination->projectFor(new Some(self::OTHER)));
        $this->assertEquals(ProjectOwner::global(), $destination->ownerFor(new Some(ProjectDestinationContract::GLOBAL)));
    }

    public function test_all_projects_without_a_choice_is_refused(): void
    {
        $this->expectException(ProjectNotChosen::class);

        $this->destination(ProjectSelection::all())->projectFor(None::create());
    }

    private function destination(ProjectSelection $selection): ProjectDestination
    {
        $projects = $this->createStub(CurrentProject::class);
        $projects->method('selection')->willReturn($selection);

        return new ProjectDestination($projects);
    }
}
