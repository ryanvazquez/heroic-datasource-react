import React from 'react';
import { Collapse } from '@grafana/ui';

/* 
  TODO: C/P from a md -> html dump. Refactor into styled components.
*/

const TableData = ({ children }) => <td style={{ lineHeight: '1.5', fontSize: '12px', padding: '.25em' }}>{children}</td>
const TableRow = ({ children, style = {} }) => <tr style={{ margin: '.5em', ...style }}>{children}</tr>
const Code = ({ children }) => <code style={{ fontSize: '10px' }}>{children}</code>

export const SyntaxHelp = ({ isCollapsed }) => {
  const [isOpen, setIsOpen] = React.useState(isCollapsed);

  return (
    <Collapse label="Syntax Help" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      <table>
        <tbody>
          <TableRow style={rowStyles}>
            <TableData>Simple string without quotes</TableData>
            <TableData><Code>hello1234</Code></TableData>
            <TableData>Simple string with quotes</TableData>
            <TableData><Code>&quot;hello world $&quot;</Code></TableData>
          </TableRow>
          <TableRow>
            <TableData>tag <Code>foo</Code> <em>equals to</em> <Code>bar</Code></TableData>
            <TableData><Code>foo = bar</Code></TableData>
            <TableData>tag <Code>foo</Code> <em>does not equal to</em> <Code>bar</Code></TableData>
            <TableData><Code>foo != bar</Code></TableData>
          </TableRow>
          <TableRow style={rowStyles}>
            <TableData>key <em>equals to</em> <Code>bar</Code></TableData>
            <TableData><Code>$key = bar</Code></TableData>
            <TableData>key <em>does not equal to</em> <Code>bar</Code></TableData>
            <TableData><Code>$key != bar</Code></TableData>
          </TableRow>
          <TableRow>
            <TableData>tag <Code>foo</Code> <em>equals to either</em> <Code>bar</Code>, or <Code>baz</Code></TableData>
            <TableData><Code>foo in [bar, baz]</Code></TableData>
            <TableData>tag <Code>foo</Code> <em>does not equal to either</em> <Code>bar</Code>, or <Code>baz</Code></TableData>
            <TableData><Code>foo not in [bar, baz]</Code></TableData>
          </TableRow>
          <TableRow style={rowStyles}>
            <TableData>tag <Code>foo</Code> <em>exists</em></TableData>
            <TableData><Code>+foo</Code></TableData>
            <TableData>tag <Code>foo</Code> <em>does not exist</em></TableData>
            <TableData><Code>!+foo</Code></TableData>
          </TableRow>
          <TableRow>
            <TableData>tag <Code>foo</Code> <em>is</em> prefixed with <Code>bar</Code></TableData>
            <TableData><Code>foo ^ bar</Code></TableData>
            <TableData>tag <Code>foo</Code> <em>is not</em> prefixed with <Code>bar</Code></TableData>
            <TableData><Code>foo !^ bar</Code></TableData>
          </TableRow>
          <TableRow style={rowStyles}>
            <TableData>Expression <Code>&lt;a&gt;</Code> and <Code>&lt;b&gt;</Code>, must be true</TableData>
            <TableData><Code>&lt;a&gt; and &lt;b&gt;</Code></TableData>
            <TableData>Any expression <Code>&lt;a&gt;</Code> or <Code>&lt;b&gt;</Code>, must be true</TableData>
            <TableData><Code>&lt;a&gt; or &lt;b&gt;</Code></TableData>
          </TableRow>
          <TableRow>
            <TableData>Invert</TableData>
            <TableData><Code>! (&lt;a&gt; and &lt;b&gt;)</Code></TableData>
            <TableData>Override grouping</TableData>
            <TableData><Code>(&lt;a&gt; or &lt;b&gt;) and &lt;c&gt;</Code></TableData>
          </TableRow>
        </tbody>
      </table>
    </Collapse>
  )
}

const rowStyles = {
  backgroundColor: 'rgba(0, 0, 0, .25',
  margin: '.25em'
}