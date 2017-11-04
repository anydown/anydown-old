import test from 'ava';
import * as kanban from './src/renderer/components/kanban-compiler';
import * as gantt from './src/renderer/components/gantt-compiler';
import * as documentCompiler from './src/renderer/util/document-compiler'

test(t => {
	const kanbanInput = "kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n"
	const kanbanCompiled = kanban.compileKanban(kanbanInput)
	const expected = [
		{ name: 'TODO', cards: ['タスク'] },
		{ name: 'DONE', cards: ['test1', 'test2', 'test3'] }
	];
	t.deepEqual(kanbanCompiled, expected);
});


test(t => {
	const kanbanData = [
		{ name: 'TODO', cards: ['タスク'] },
		{ name: 'DONE', cards: ['test1', 'test2', 'test3'] }
	];
	const kanbanSerialized = kanban.serializeKanban(kanbanData)
	const kanbanSource = "kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n"
	t.deepEqual(kanbanSerialized, kanbanSource);
});


test(t => {
	const input = "gantt\nTask1 2017-11-04 2017-11-07\nTask2 2017-11-05 2017-11-08\n"
	const tasks = gantt.compile(input)
	const expected = [
		{ name: 'Task1', start: 1509721200000, end: 1510066800000 },
		{ name: 'Task2', start: 1509807600000, end: 1510153200000 },
	];
	t.deepEqual(tasks, expected);
});

test(t => {
	const tasks = [
		{ name: 'Task1', start: 1509721200000, end: 1509980400000 },
		{ name: 'Task2', start: 1509807600000, end: 1510066800000 },
	];
	const str = gantt.serialize(tasks)
	const expected = "gantt\nTask1 2017-11-04 2017-11-06\nTask2 2017-11-05 2017-11-07\n"
	t.deepEqual(str, expected)
})


test(t => {
	const pageStr = "#hoge\n```kanban\n\n```\n##fuga\n```gantt\n\n```\n"
	var doc = documentCompiler.compile(pageStr)
	const expected = [
		{id: 0, text: "#hoge\n", type: "markdown-block"},
		{id: 1, text: "kanban\n\n", type: "code-block-kanban"},
		{id: 2, text: "\n##fuga\n", type: "markdown-block"},
		{id: 3, text: "gantt\n\n", type: "code-block-gantt"},
		{id: 4, text: "\n", type: "markdown-block"}
	];
	t.deepEqual(doc, expected);
	
})