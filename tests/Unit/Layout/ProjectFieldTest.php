<?php

declare(strict_types=1);

namespace Tests\Unit\Layout;

use App\Contracts\Projects\CurrentProject;
use App\Contracts\Projects\ProjectDestination;
use App\Contracts\Projects\ProjectDirectory;
use App\Data\Projects\ProjectData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\ProjectField;
use App\Values\ProjectSelection;
use PHPUnit\Framework\TestCase;

/**
 * Under All projects a create dialog gets a choice of every project, with the key beside a shared label, and Global
 * last when the record may be Global; within one project it gets no field.
 */
final class ProjectFieldTest extends TestCase
{
    public function test_all_projects_offer_every_project_by_label_with_the_key_beside_a_shared_one(): void
    {
        $field = $this->onlyFieldOf($this->field(ProjectSelection::all())->forProject());

        $this->assertSame(ProjectField::NAME, $field->name);
        $this->assertSame(['p1', 'p2', 'p3'], $field->options);
        $this->assertSame(['Shop', 'Web (web-a)', 'Web (web-b)'], $field->optionLabels);
    }

    public function test_a_record_that_may_be_global_offers_global_after_the_projects(): void
    {
        $field = $this->onlyFieldOf($this->field(ProjectSelection::all())->forProjectOrGlobal());

        $this->assertSame(['p1', 'p2', 'p3', ProjectDestination::GLOBAL], $field->options);
        $this->assertCount(4, $field->optionLabels);
    }

    public function test_within_one_project_no_field_is_added(): void
    {
        $field = $this->field(ProjectSelection::of('p1'));

        $this->assertSame([], $field->forProject());
        $this->assertSame([], $field->forProjectOrGlobal());
    }

    /**
     * @param  list<LayoutPartData>  $parts
     */
    private function onlyFieldOf(array $parts): LayoutFieldData
    {
        $this->assertCount(1, $parts);
        $field = $parts[0]->field;
        $this->assertInstanceOf(LayoutFieldData::class, $field);

        return $field;
    }

    private function field(ProjectSelection $selection): ProjectField
    {
        $projects = $this->createStub(CurrentProject::class);
        $projects->method('selection')->willReturn($selection);
        $directory = $this->createStub(ProjectDirectory::class);
        $directory->method('listed')->willReturn([
            new ProjectData('p1', 'shop', 'Shop'),
            new ProjectData('p2', 'web-a', 'Web'),
            new ProjectData('p3', 'web-b', 'Web'),
        ]);

        return new ProjectField($projects, $directory);
    }
}
