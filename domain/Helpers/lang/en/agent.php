<?php

declare(strict_types=1);

// The texts the Helpers domain puts in an agent's context.
return [
    'identity' => 'You are helper {helper} (profile {profile}, revision {revision}), on job {job} for: {purpose}',
    'brief' => "Your brief:\n{brief}",
    'steering' => 'Steering from your parent: {steering}',
    'source' => 'Given as your source: {subject}',
    'held' => 'Helper {helper} failed its final checks on job {job} three times the same way: the job is held for '
        .'repair',
    'unfinished' => 'Helper {helper} stopped before job {job} was finished: continue it with {command}',
    'notice' => 'About your helper: {notice}',
];
