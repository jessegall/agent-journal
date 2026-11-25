<?php

declare(strict_types=1);

namespace Tests\Unit\Projects;

use App\Enums\Projects\ProjectSelectionType;
use App\Exceptions\ProjectNotChosen;
use App\Values\ProjectOwner;
use App\Values\ProjectSelection;
use PHPUnit\Framework\TestCase;

/**
 * The three selections and their keys, and an owner that is Global names no project.
 */
final class ProjectSelectionTest extends TestCase
{
    private const string PROJECT = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    private const string OTHER_PROJECT = '01jd8x0g9m3qz6v4k2t7r5w1cf';

    public function test_a_selection_of_one_project_names_it_and_is_keyed_by_it(): void
    {
        $selection = ProjectSelection::of(self::PROJECT);

        $this->assertSame(ProjectSelectionType::Project, $selection->type);
        $this->assertSame(self::PROJECT, $selection->projectId());
        $this->assertSame(self::PROJECT, $selection->key());
    }

    public function test_all_and_none_are_keyed_by_their_type_and_name_no_project(): void
    {
        foreach ([ProjectSelection::all(), ProjectSelection::none()] as $selection) {
            $this->assertSame($selection->type->value, $selection->key());

            try {
                $selection->projectId();
                $this->fail('A selection without a project named one.');
            } catch (ProjectNotChosen) {
                $this->addToAssertionCount(1);
            }
        }

        $this->assertNotSame(ProjectSelection::all()->key(), ProjectSelection::none()->key());
    }

    public function test_global_is_not_a_project(): void
    {
        $global = ProjectOwner::global();

        $this->assertTrue($global->isGlobal());
        $this->assertFalse(ProjectOwner::ofProject(self::PROJECT)->isGlobal());
        $this->assertSame(self::PROJECT, ProjectOwner::ofProject(self::PROJECT)->projectId());

        $this->expectException(ProjectNotChosen::class);

        $global->projectId();
    }

    public function test_an_owner_joins_its_own_project_and_global_only(): void
    {
        $owner = ProjectOwner::ofProject(self::PROJECT);

        $this->assertTrue($owner->mayJoin(ProjectOwner::ofProject(self::PROJECT)));
        $this->assertTrue($owner->mayJoin(ProjectOwner::global()));
        $this->assertFalse($owner->mayJoin(ProjectOwner::ofProject(self::OTHER_PROJECT)));
        $this->assertTrue(ProjectOwner::global()->mayJoin(ProjectOwner::global()));
        $this->assertFalse(ProjectOwner::global()->mayJoin($owner));
    }
}
