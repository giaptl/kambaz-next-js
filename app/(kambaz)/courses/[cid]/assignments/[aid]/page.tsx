export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name"><h3>Assignment Name</h3></label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.
      </textarea>
      <br />
      <table>
        <br></br>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
          </td>
        </tr>
        <br></br>
              
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
              <option>ASSIGNMENTS</option>
            </select>
          </td>
        </tr>
        <br></br>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-grade">Display Grade as</label>
          </td>
          <td>
            <select id="wd-grade">
              <option>Percentage</option>
            </select>
          </td>
        </tr>
        <br></br>


        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-type">
              <option>Online</option>
            </select>
          </td>
        </tr>
        <br></br>

        
        <tr>
          <td></td>
          <td>
            Online Entry Options<br />
            <label htmlFor="wd-text-entry">
      <input id="wd-text-entry" type="checkbox" /> Text Entry
    </label><br />

    <label htmlFor="wd-website-url">
      <input id="wd-website-url" type="checkbox" /> Website URL
    </label><br />

    <label htmlFor="wd-media">
      <input id="wd-media" type="checkbox" /> Media Recordings
    </label><br />

    <label htmlFor="wd-annotation">
      <input id="wd-annotation" type="checkbox" /> Student Annotation
    </label><br />

    <label htmlFor="wd-file-uploads">
      <input id="wd-file-uploads" type="checkbox" /> File Uploads
    </label>
          </td>
        </tr>
        <br></br>

        
        <tr>
  <td align="right" valign="top">
    Assign
  </td>
  <td>
    <label htmlFor="wd-assign-to">Assign to</label><br />
    <input id="wd-assign-to" defaultValue="Everyone" />
  </td>
</tr>
        <br></br>

        <tr>
  <td></td>
  <td>
    <label htmlFor="wd-due-date">Due</label><br />
    <input id="wd-due-date" type="date" defaultValue="2024-05-13" />
  </td>
</tr>
        <br></br>

        <tr>
  <td></td>
  <td>
    <div style={{ display: "inline-block", marginRight: "20px" }}>
      <label htmlFor="wd-available-from">Available from</label><br />
      <input
        id="wd-available-from"
        type="date"
        defaultValue="2024-05-06"
      />
    </div>

    <div style={{ display: "inline-block" }}>
      <label htmlFor="wd-until">Until</label><br />
      <input
        id="wd-until"
        type="date"
        defaultValue="2024-05-20"
      />
    </div>
  </td>
</tr>


      </table>

      <hr />

      <div style={{ textAlign: "right" }}>
        <button>Cancel</button>
        <button>Save</button>
      </div>

    
    </div>
);}

